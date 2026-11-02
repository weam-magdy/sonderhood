<?php
// Shared by visit.php and stats.php: where the totals live and which day it is in Cairo.
// Asking for this file directly prints nothing.

const COUNTS_DIR = __DIR__ . '/../visit-counts';

date_default_timezone_set('Africa/Cairo');
