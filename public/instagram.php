<?php
// The latest Instagram posts for the grid at the end of the home page.
//
// They come from a Behold JSON feed (behold.so, free plan: up to 6 posts, refreshed
// by Behold about once a day). This script asks Behold at most every few hours and
// copies the photos into /instagram/ on this site, so visitors load nothing from
// Behold or Instagram, and the free plan's monthly view limit is never reached.
// The feed address is public by design (Behold serves it to browsers), so it can
// live here. Until it is set the grid stays hidden.

const FEED_URL = '';
const MAX_POSTS = 6;
const REFRESH_SECONDS = 4 * 3600;
const CACHE_DIR = __DIR__ . '/instagram';
const CACHE_FILE = CACHE_DIR . '/feed.json';
const EMPTY_FEED = '{"posts":[]}';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=600');
header('X-Content-Type-Options: nosniff');

function respond($json)
{
    echo $json;
    exit;
}

function fetch_url($url)
{
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 3,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'TheSonderHood-site/1.0',
        ]);
        $body = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        curl_close($curl);
        return ($body !== false && $status >= 200 && $status < 300) ? $body : false;
    }
    $context = stream_context_create(['http' => ['timeout' => 10, 'header' => "User-Agent: TheSonderHood-site/1.0\r\n"]]);
    return @file_get_contents($url, false, $context);
}

// The file type from the first bytes, or null for anything that is not a photo.
function image_extension($bytes)
{
    if (substr($bytes, 0, 4) === 'RIFF' && substr($bytes, 8, 4) === 'WEBP') return 'webp';
    if (substr($bytes, 0, 3) === "\xFF\xD8\xFF") return 'jpg';
    if (substr($bytes, 0, 8) === "\x89PNG\r\n\x1A\n") return 'png';
    return null;
}

$cached = is_file(CACHE_FILE) ? file_get_contents(CACHE_FILE) : false;
if ($cached !== false && time() - filemtime(CACHE_FILE) < REFRESH_SECONDS) respond($cached);
if (FEED_URL === '') respond($cached !== false ? $cached : EMPTY_FEED);

if (!is_dir(CACHE_DIR)) @mkdir(CACHE_DIR, 0755, true);

// One visitor refreshes; the others get the copy already here.
$lock = @fopen(CACHE_DIR . '/refresh.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) respond($cached !== false ? $cached : EMPTY_FEED);

$raw = fetch_url(FEED_URL);
$feed = $raw !== false ? json_decode($raw, true) : null;
if (!is_array($feed) || !isset($feed['posts']) || !is_array($feed['posts'])) {
    // Behold did not answer: keep the old copy and try again after REFRESH_SECONDS.
    if ($cached !== false) {
        @touch(CACHE_FILE);
        respond($cached);
    }
    respond(EMPTY_FEED);
}

$posts = [];
foreach ($feed['posts'] as $post) {
    if (count($posts) >= MAX_POSTS) break;
    $id = preg_replace('/[^0-9A-Za-z_]/', '', (string) ($post['id'] ?? ''));
    $link = (string) ($post['permalink'] ?? '');
    $source = $post['sizes']['medium']['mediaUrl'] ?? ($post['sizes']['small']['mediaUrl'] ?? '');
    if ($id === '' || !preg_match('#^https://(www\.)?instagram\.com/#', $link)) continue;
    if (!preg_match('#^https://([a-z0-9-]+\.)*behold\.pictures/#i', (string) $source)) continue;

    $existing = glob(CACHE_DIR . '/' . $id . '.{webp,jpg,png}', GLOB_BRACE);
    $file = $existing ? $existing[0] : null;
    if (!$file) {
        $bytes = fetch_url($source);
        $extension = $bytes !== false && strlen($bytes) < 4000000 ? image_extension($bytes) : null;
        if (!$extension) continue;
        $file = CACHE_DIR . '/' . $id . '.' . $extension;
        file_put_contents($file, $bytes, LOCK_EX);
    }

    $text = trim((string) ($post['altText'] ?? ''));
    if ($text === '') $text = trim((string) ($post['prunedCaption'] ?? ''));
    $posts[] = [
        'id' => $id,
        'link' => $link,
        'image' => '/instagram/' . basename($file),
        'alt' => $text !== '' ? mb_substr($text, 0, 160) : 'A post from The Sonder Hood on Instagram',
        'video' => ($post['mediaType'] ?? '') === 'VIDEO',
    ];
}

$json = json_encode(['posts' => $posts], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
file_put_contents(CACHE_FILE, $json, LOCK_EX);
flock($lock, LOCK_UN);
respond($json);
