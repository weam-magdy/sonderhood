<?php
// The owner's private page of daily visits, from the totals visit.php keeps.
//
// It opens only with the secret in stats-config.php (`<?php return '<key>';`), which is
// not in the public GitHub repository, as /stats.php?key=<key>. Anything else gets the
// site's 404. Opening it also marks that browser so the owner's own visits aren't counted.

require __DIR__ . '/visit-counts.php';

const DAYS_SHOWN = 30;
const TABLE_DAYS = 14;
const LIST_ROWS = 10;

header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$config = is_file(__DIR__ . '/stats-config.php') ? include __DIR__ . '/stats-config.php' : '';
$key = is_string($config) ? $config : '';
if (strlen($key) < 20 || !hash_equals($key, (string) ($_GET['key'] ?? ''))) {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/404.html');
    exit;
}

function esc($text)
{
    return htmlspecialchars((string) $text, ENT_QUOTES, 'UTF-8');
}

function number($value)
{
    return number_format((int) $value);
}

// The last $count days, oldest first, with an empty day where nothing was counted.
function load_days($count)
{
    $months = [];
    $days = [];
    for ($back = $count - 1; $back >= 0; $back--) {
        $time = strtotime("-{$back} days");
        $date = date('Y-m-d', $time);
        $month = date('Y-m', $time);
        if (!isset($months[$month])) {
            $file = COUNTS_DIR . '/' . $month . '.json';
            $saved = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
            $months[$month] = is_array($saved) ? $saved : [];
        }
        $empty = ['visits' => 0, 'views' => 0, 'pages' => [], 'sources' => [], 'devices' => []];
        $days[$date] = array_merge($empty, $months[$month][$date] ?? []);
    }
    return $days;
}

function total($days, $field)
{
    return array_sum(array_column($days, $field));
}

// Adds up one breakdown over the days, largest first.
function tally($days, $field)
{
    $sum = [];
    foreach ($days as $day) {
        foreach ($day[$field] as $name => $count) $sum[$name] = ($sum[$name] ?? 0) + $count;
    }
    arsort($sum);
    return $sum;
}

function tile($label, $days)
{
    $views = total($days, 'views');
    return '<div class="tile"><p class="tileLabel">' . esc($label) . '</p>'
        . '<p class="tileValue">' . number(total($days, 'visits')) . '</p>'
        . '<p class="tileNote">' . number($views) . ($views === 1 ? ' page' : ' pages') . ' viewed</p></div>';
}

function ranked_list($title, $rows, $unit)
{
    $html = '<section class="panel"><h2>' . esc($title) . '</h2>';
    if (!$rows) return $html . '<p class="empty">Nothing counted yet.</p></section>';
    $top = max($rows);
    $html .= '<ol class="rows">';
    foreach (array_slice($rows, 0, LIST_ROWS, true) as $name => $count) {
        $width = max(1, round($count / $top * 100, 1));
        $html .= '<li><div class="rowText"><span class="rowName">' . esc($name) . '</span>'
            . '<span class="rowCount" aria-label="' . number($count) . ' ' . esc($unit) . '">' . number($count) . '</span></div>'
            . '<div class="rowBar" style="width:' . $width . '%"></div></li>';
    }
    return $html . '</ol></section>';
}

$days = load_days(DAYS_SHOWN);
$dates = array_keys($days);
$today = array_slice($days, -1, 1, true);
$yesterday = array_slice($days, -2, 1, true);
$week = array_slice($days, -7, 7, true);
$highest = max(1, max(array_column($days, 'visits')));

$bars = '';
foreach ($days as $date => $day) {
    $height = $day['visits'] ? max(2, round($day['visits'] / $highest * 100, 1)) : 0;
    $label = date('D j M', strtotime($date));
    $bars .= '<button type="button" class="bar" data-tip="' . esc($label . ': ' . number($day['visits']) . ($day['visits'] === 1 ? ' visit' : ' visits')) . '">'
        . '<span style="height:' . $height . '%"></span></button>';
}

$table = '';
foreach (array_reverse(array_slice($days, -TABLE_DAYS, TABLE_DAYS, true), true) as $date => $day) {
    $table .= '<tr><th scope="row">' . esc(date('D j M', strtotime($date))) . '</th><td>' . number($day['visits']) . '</td><td>' . number($day['views']) . '</td></tr>';
}

header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Visitors | The Sonder Hood</title>
<link rel="icon" href="/favicon.ico">
<style>
:root { --surface: #FFFDF4; --panel: #F9F3D0; --ink: #464834; --muted: #6A6C55; --mark: #464834; --line: #E4DDB6; }
@media (prefers-color-scheme: dark) {
    :root { --surface: #22231A; --panel: #2E3024; --ink: #F9F3D0; --muted: #C4C0A2; --mark: #D9D2A4; --line: #45473A; }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--surface); color: var(--ink); font: 16px/1.45 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
main { max-width: 860px; margin: 0 auto; padding: 28px 16px 48px; }
h1 { font: 600 28px/1.2 Georgia, 'Times New Roman', serif; margin: 0; }
h2 { font-size: 16px; margin: 0 0 14px; }
.lead { color: var(--muted); margin: 6px 0 22px; }
.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 12px; }
.tile, .panel { background: var(--panel); border-radius: 12px; padding: 16px; }
.tile p { margin: 0; }
.tileLabel { font-size: 14px; color: var(--muted); }
.tileValue { font-size: 34px; font-weight: 650; line-height: 1.2; font-variant-numeric: tabular-nums; }
.tileNote { font-size: 13px; color: var(--muted); }
.panel { margin-bottom: 12px; min-width: 0; }
.columns { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.columns .panel { margin-bottom: 0; }
.columns { margin-bottom: 12px; }
.chart { position: relative; }
.bars { display: flex; align-items: flex-end; gap: 2px; height: 180px; border-bottom: 1px solid var(--line); }
.bar { flex: 1; height: 100%; min-width: 0; padding: 0; border: 0; background: none; display: flex; align-items: flex-end; cursor: pointer; }
.bar span { display: block; width: 100%; max-width: 18px; margin: 0 auto; background: var(--mark); border-radius: 4px 4px 0 0; }
.bar:hover, .bar:focus-visible { background: var(--line); outline: none; }
.axis { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); margin-top: 6px; }
.tip { position: absolute; top: 0; left: 0; transform: translateX(-50%); background: var(--ink); color: var(--surface); font-size: 13px; padding: 4px 8px; border-radius: 6px; white-space: nowrap; pointer-events: none; display: none; }
.rows { list-style: none; margin: 0; padding: 0; }
.rows li { margin-bottom: 10px; }
.rowText { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; }
.rowName { overflow-wrap: anywhere; }
.rowCount { font-variant-numeric: tabular-nums; }
.rowBar { height: 4px; margin-top: 3px; background: var(--mark); border-radius: 2px; }
.empty { color: var(--muted); margin: 0; }
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
th, td { padding: 6px 0; border-bottom: 1px solid var(--line); text-align: right; font-weight: 400; font-size: 15px; }
th:first-child { text-align: left; }
thead th { color: var(--muted); font-size: 14px; }
.note { color: var(--muted); font-size: 14px; margin: 16px 0 0; }
@media (max-width: 640px) {
    .tiles, .columns { grid-template-columns: repeat(2, 1fr); }
    .columns { grid-template-columns: 1fr; }
    .tileValue { font-size: 30px; }
}
</style>
</head>
<body>
<main>
    <h1>Visitors</h1>
    <p class="lead">The Sonder Hood, up to <?= esc(date('D j M, g:i a')) ?> Cairo time</p>

    <div class="tiles">
        <?= tile('Today', $today) ?>
        <?= tile('Yesterday', $yesterday) ?>
        <?= tile('Last 7 days', $week) ?>
        <?= tile('Last 30 days', $days) ?>
    </div>

    <section class="panel">
        <h2>Visits each day</h2>
        <div class="chart">
            <div class="tip" id="tip" role="status"></div>
            <div class="bars"><?= $bars ?></div>
            <div class="axis"><span><?= esc(date('j M', strtotime($dates[0]))) ?></span><span>Highest day: <?= number(max(array_column($days, 'visits'))) ?></span><span>Today</span></div>
        </div>
    </section>

    <div class="columns">
        <?= ranked_list('Where visits came from', tally($days, 'sources'), 'visits') ?>
        <?= ranked_list('Most viewed pages', tally($days, 'pages'), 'views') ?>
        <?= ranked_list('Phone or computer', tally($days, 'devices'), 'visits') ?>
        <section class="panel">
            <h2>Last 14 days</h2>
            <table>
                <thead><tr><th scope="col">Day</th><th scope="col">Visits</th><th scope="col">Pages</th></tr></thead>
                <tbody><?= $table ?></tbody>
            </table>
        </section>
    </div>

    <p class="note">A visit is one person arriving at the site, so someone who comes back later counts again. Search engine robots are left out, and this browser no longer counts as a visitor. Lists cover the last 30 days. Totals are higher than Google Analytics, which only counts people who accept the cookie notice.</p>
</main>
<script>
try { localStorage.setItem('sonderhood-not-counted', '1') } catch (error) {}
var tip = document.getElementById('tip')
var chart = tip.parentNode
function show(event) {
    var bar = event.target.closest('.bar')
    if (!bar) { tip.style.display = 'none'; return }
    tip.textContent = bar.getAttribute('data-tip')
    tip.style.display = 'block'
    var box = chart.getBoundingClientRect(), spot = bar.getBoundingClientRect()
    var half = tip.offsetWidth / 2
    tip.style.left = Math.min(box.width - half, Math.max(half, spot.left - box.left + spot.width / 2)) + 'px'
}
chart.addEventListener('mouseover', show)
chart.addEventListener('focusin', show)
chart.addEventListener('click', show)
chart.addEventListener('mouseleave', function () { tip.style.display = 'none' })
</script>
</body>
</html>
