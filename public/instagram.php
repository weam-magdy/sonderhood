<?php
// The latest Instagram posts for the grid at the end of the home page.
//
// They come from a Behold JSON feed (behold.so, free plan: up to 6 posts, refreshed
// by Behold about once a day). This script asks Behold at most every few hours and
// copies the photos into /instagram/ on this site, so visitors load nothing from
// Behold or Instagram, and the free plan's monthly view limit is never reached.
//
// The feed address goes in instagram-config.php next to this script:
//     <?php return 'https://feeds.behold.so/...';
// That file is not in the public GitHub repository (every request to the feed counts
// as a view), and the server runs it rather than showing it. Until it exists the grid
// stays hidden.

const MAX_POSTS = 6;
const REFRESH_SECONDS = 4 * 3600;
const RETRY_SECONDS = 3600;
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
        return ($body !== false && $status >= 200 && $status < 300) ? $body : false;
    }
    $context = stream_context_create(['http' => ['timeout' => 10, 'header' => "User-Agent: TheSonderHood-site/1.0\r\n"]]);
    return @file_get_contents($url, false, $context);
}

// A caption or alt text on one line, for the photo's description.
function one_line($text)
{
    return trim((string) preg_replace('/\s+/u', ' ', (string) $text));
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

$config = is_file(__DIR__ . '/instagram-config.php') ? include __DIR__ . '/instagram-config.php' : '';
$feed_url = is_string($config) ? trim($config) : '';
if (!preg_match('#^https://feeds\.behold\.so/#', $feed_url)) respond($cached !== false ? $cached : EMPTY_FEED);

if (!is_dir(CACHE_DIR)) @mkdir(CACHE_DIR, 0755, true);

// One visitor refreshes; the others get the copy already here.
$lock = @fopen(CACHE_DIR . '/refresh.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) respond($cached !== false ? $cached : EMPTY_FEED);

// Note the attempt before asking Behold, so the next try waits an hour even if this
// one never finishes (LiteSpeed stops a script when its visitor leaves). Every request
// to the feed counts as a view on the free plan, so a fault must never turn each
// visit into a request. A successful refresh rewrites the file below.
if ($cached === false) file_put_contents(CACHE_FILE, EMPTY_FEED, LOCK_EX);
@touch(CACHE_FILE, time() - REFRESH_SECONDS + RETRY_SECONDS);

$raw = fetch_url($feed_url);
$feed = $raw !== false ? json_decode($raw, true) : null;
// Behold did not answer, or the feed is paused: keep what is here.
if (!is_array($feed) || !isset($feed['posts']) || !is_array($feed['posts'])) respond($cached !== false ? $cached : EMPTY_FEED);

$posts = [];
foreach ($feed['posts'] as $post) {
    if (count($posts) >= MAX_POSTS) break;
    if (!is_array($post)) continue;
    $id = preg_replace('/[^0-9A-Za-z_]/', '', (string) ($post['id'] ?? ''));
    $link = (string) ($post['permalink'] ?? '');
    $source = $post['sizes']['medium']['mediaUrl'] ?? ($post['sizes']['small']['mediaUrl'] ?? '');
    if ($id === '' || !preg_match('#^https://(www\.)?instagram\.com/#', $link)) continue;
    if (!preg_match('#^https://([a-z0-9-]+\.)*behold\.pictures/#i', (string) $source)) continue;

    $file = null;
    foreach (['webp', 'jpg', 'png'] as $extension) {
        if (is_file(CACHE_DIR . '/' . $id . '.' . $extension)) $file = CACHE_DIR . '/' . $id . '.' . $extension;
    }
    if (!$file) {
        $bytes = fetch_url($source);
        $extension = $bytes !== false && strlen($bytes) < 4000000 ? image_extension($bytes) : null;
        if (!$extension) continue;
        $file = CACHE_DIR . '/' . $id . '.' . $extension;
        if (file_put_contents($file, $bytes, LOCK_EX) === false) continue;
    }

    $text = one_line($post['altText'] ?? '');
    if ($text === '') $text = one_line($post['prunedCaption'] ?? '');
    $posts[] = [
        'id' => $id,
        'link' => $link,
        'image' => '/instagram/' . basename($file),
        'alt' => $text !== '' ? mb_substr($text, 0, 160, 'UTF-8') : 'A post from The Sonder Hood on Instagram',
        'video' => ($post['mediaType'] ?? '') === 'VIDEO',
    ];
}

$json = json_encode(['posts' => $posts], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if ($json === false) $json = EMPTY_FEED;
file_put_contents(CACHE_FILE, $json, LOCK_EX);

// Photos of posts that have left the feed are removed, so a post taken down on
// Instagram does not stay on this site. Those the previous list showed are kept until
// the next refresh, for browsers that still hold that list (it is cached for 10 minutes).
$keep = array_map(function ($post) { return basename($post['image']); }, $posts);
$previous = $cached !== false ? json_decode($cached, true) : null;
$previous_posts = (is_array($previous) && isset($previous['posts']) && is_array($previous['posts'])) ? $previous['posts'] : [];
foreach ($previous_posts as $post) {
    if (is_array($post) && isset($post['image'])) $keep[] = basename((string) $post['image']);
}
foreach (glob(CACHE_DIR . '/*') ?: [] as $old) {
    if (preg_match('/^[0-9A-Za-z_]+\.(webp|jpg|png)$/', basename($old)) && !in_array(basename($old), $keep, true)) @unlink($old);
}

flock($lock, LOCK_UN);
respond($json);
