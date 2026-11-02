<?php
// Adds one page view to the site's own daily totals, for the private page stats.php.
//
// src/analytics.js sends the page's address, whether this is the first page of a visit,
// and the host of the site that sent the visitor. This script keeps only totals: no
// cookie, no internet address, no browser details and nothing that links one page view
// to another. Totals sit in visit-counts/<year>-<month>.json beside public_html, so they
// can't be opened from the web and an upload never touches them.

require __DIR__ . '/visit-counts.php';

const MAX_BODY_BYTES = 2000;
const BOTS = '/bot|crawl|spider|slurp|preview|lighthouse|headless|pagespeed|facebookexternalhit|whatsapp|telegram|curl|wget|python|node/i';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function finish()
{
    http_response_code(204);
    exit;
}

// Which kind of site sent the visitor; the host itself is not kept.
function source_of($host)
{
    $host = strtolower($host);
    if ($host === '') return 'Direct or unknown';
    $known = [
        'google' => 'Google', 'bing' => 'Bing', 'instagram' => 'Instagram', 'facebook' => 'Facebook',
        'fb.' => 'Facebook', 'whatsapp' => 'WhatsApp', 'wa.me' => 'WhatsApp', 'chatgpt' => 'ChatGPT',
        'openai' => 'ChatGPT', 'perplexity' => 'Perplexity', 'copilot' => 'Copilot', 'linkedin' => 'LinkedIn',
        'tiktok' => 'TikTok', 'youtube' => 'YouTube', 'yahoo' => 'Yahoo', 'duckduckgo' => 'DuckDuckGo',
    ];
    foreach ($known as $name => $label) {
        if (strpos($host, $name) !== false) return $label;
    }
    return 'Other sites';
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') finish();
if (($_SERVER['HTTP_ORIGIN'] ?? '') !== 'https://www.the-sonderhood.com') finish();

$agent = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
if ($agent === '' || preg_match(BOTS, $agent)) finish();

$body = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($body === false || strlen($body) > MAX_BODY_BYTES) finish();
$hit = json_decode($body, true);
if (!is_array($hit)) finish();

// Only pages that exist are counted, so a mistyped or made-up address adds nothing.
$path = (string) ($hit['path'] ?? '');
if (!preg_match('#^/([a-z0-9-]+(/[a-z0-9-]+)*)?$#', $path)) finish();
if ($path !== '/' && !is_file(__DIR__ . '/_pages' . $path . '.html')) finish();

if (!is_dir(COUNTS_DIR)) @mkdir(COUNTS_DIR, 0755, true);
$file = @fopen(COUNTS_DIR . '/' . date('Y-m') . '.json', 'c+');
if (!$file || !flock($file, LOCK_EX)) finish();

$month = json_decode((string) stream_get_contents($file), true);
if (!is_array($month)) $month = [];
$day = date('Y-m-d');
if (!isset($month[$day])) $month[$day] = ['visits' => 0, 'views' => 0, 'pages' => [], 'sources' => [], 'devices' => []];

$month[$day]['views']++;
$month[$day]['pages'][$path] = ($month[$day]['pages'][$path] ?? 0) + 1;
if (!empty($hit['visit'])) {
    $source = source_of((string) ($hit['ref'] ?? ''));
    $device = preg_match('/Mobi|Android|iPhone|iPad/', $agent) ? 'Phone' : 'Computer';
    $month[$day]['visits']++;
    $month[$day]['sources'][$source] = ($month[$day]['sources'][$source] ?? 0) + 1;
    $month[$day]['devices'][$device] = ($month[$day]['devices'][$device] ?? 0) + 1;
}

rewind($file);
ftruncate($file, 0);
fwrite($file, json_encode($month, JSON_UNESCAPED_SLASHES));
fflush($file);
flock($file, LOCK_UN);
finish();
