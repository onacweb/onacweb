<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

session_name('MBYSESSID');
// PHP 7.x ve 8.x hostinglerle uyumlu oturum ayari.
$secureCookie = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
if (PHP_VERSION_ID >= 70300) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secureCookie,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
} else {
    session_set_cookie_params(0, '/; samesite=Lax', '', $secureCookie, true);
}
session_start();

const DATA_DIR = __DIR__ . '/data';
const USERS_FILE = DATA_DIR . '/users.json';
const LOCATIONS_FILE = DATA_DIR . '/locations.json';


function lowerText(string $s): string {
    return function_exists('mb_strtolower') ? mb_strtolower($s, 'UTF-8') : strtolower($s);
}

function respond(array $data, int $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ensureStorage(): void {
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0755, true) && !is_dir(DATA_DIR)) {
        respond(['ok' => false, 'error' => 'Veri klasörü oluşturulamadı. Hosting yazma iznini kontrol edin.'], 500);
    }
    if (!file_exists(USERS_FILE)) {
        $seed = [[
            'id' => 1,
            'username' => 'Admin',
            'password_hash' => password_hash('635825', PASSWORD_DEFAULT),
            'role' => 'Yönetici',
            'status' => 'Aktif',
            'created' => date('d.m.Y H:i')
        ]];
        saveUsers($seed);
    }
    if (!file_exists(LOCATIONS_FILE)) {
        saveLocations([]);
    }
}

function loadUsers(): array {
    ensureStorage();
    $fp = fopen(USERS_FILE, 'rb');
    if (!$fp) respond(['ok' => false, 'error' => 'Kullanıcı verisi okunamadı.'], 500);
    flock($fp, LOCK_SH);
    $json = stream_get_contents($fp) ?: '[]';
    flock($fp, LOCK_UN);
    fclose($fp);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function saveUsers(array $users): void {
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0755, true) && !is_dir(DATA_DIR)) {
        respond(['ok' => false, 'error' => 'Veri klasörü oluşturulamadı.'], 500);
    }
    $tmp = USERS_FILE . '.tmp';
    $fp = fopen($tmp, 'wb');
    if (!$fp) respond(['ok' => false, 'error' => 'Kullanıcı verisi yazılamadı. Hosting yazma iznini kontrol edin.'], 500);
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        respond(['ok' => false, 'error' => 'Veri kilidi alınamadı.'], 500);
    }
    fwrite($fp, json_encode($users, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    if (!rename($tmp, USERS_FILE)) {
        @unlink($tmp);
        respond(['ok' => false, 'error' => 'Kullanıcı verisi kaydedilemedi.'], 500);
    }
}

function loadLocations(): array {
    ensureStorage();
    $fp = fopen(LOCATIONS_FILE, 'rb');
    if (!$fp) respond(['ok' => false, 'error' => 'Konum verisi okunamadı.'], 500);
    flock($fp, LOCK_SH);
    $json = stream_get_contents($fp) ?: '[]';
    flock($fp, LOCK_UN);
    fclose($fp);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function saveLocations(array $locations): void {
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0755, true) && !is_dir(DATA_DIR)) {
        respond(['ok' => false, 'error' => 'Veri klasörü oluşturulamadı.'], 500);
    }
    $tmp = LOCATIONS_FILE . '.tmp';
    $fp = fopen($tmp, 'wb');
    if (!$fp) respond(['ok' => false, 'error' => 'Konum verisi yazılamadı. Hosting yazma iznini kontrol edin.'], 500);
    if (!flock($fp, LOCK_EX)) { fclose($fp); respond(['ok' => false, 'error' => 'Veri kilidi alınamadı.'], 500); }
    fwrite($fp, json_encode($locations, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    fflush($fp); flock($fp, LOCK_UN); fclose($fp);
    if (!rename($tmp, LOCATIONS_FILE)) { @unlink($tmp); respond(['ok' => false, 'error' => 'Konum verisi kaydedilemedi.'], 500); }
}

function body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function publicUser(array $u): array {
    return [
        'id' => (int)$u['id'],
        'username' => (string)$u['username'],
        'role' => (string)$u['role'],
        'status' => (string)$u['status'],
        'created' => (string)$u['created'],
    ];
}

function requireLogin(): array {
    if (empty($_SESSION['user'])) respond(['ok' => false, 'error' => 'Oturum bulunamadı.'], 401);
    return $_SESSION['user'];
}

function requireManager(): array {
    $u = requireLogin();
    if (!in_array($u['role'], ['Yönetici', 'Müdür'], true)) {
        respond(['ok' => false, 'error' => 'Bu işlem için yetkiniz yok.'], 403);
    }
    return $u;
}

ensureStorage();
$action = $_GET['action'] ?? '';

// Hosting/PHP testi: api.php?action=health adresi JSON dondurmelidir.
if ($action === 'health') {
    respond(['ok' => true, 'php' => PHP_VERSION, 'storage_writable' => is_writable(DATA_DIR)]);
}

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $in = body();
    $username = trim((string)($in['username'] ?? ''));
    $password = (string)($in['password'] ?? '');
    foreach (loadUsers() as $u) {
        if (lowerText((string)$u['username']) === lowerText($username) && password_verify($password, (string)$u['password_hash'])) {
            if (($u['status'] ?? '') !== 'Aktif') respond(['ok' => false, 'error' => 'Bu kullanıcı hesabı pasif durumda.'], 403);
            session_regenerate_id(true);
            $_SESSION['user'] = publicUser($u);
            respond(['ok' => true, 'user' => $_SESSION['user']]);
        }
    }
    respond(['ok' => false, 'error' => 'Kullanıcı adı / ID veya şifre hatalı.'], 401);
}

if ($action === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', (bool)$p['secure'], (bool)$p['httponly']);
    }
    session_destroy();
    respond(['ok' => true]);
}

if ($action === 'me') {
    if (empty($_SESSION['user'])) respond(['ok' => true, 'user' => null]);
    respond(['ok' => true, 'user' => $_SESSION['user']]);
}

if ($action === 'users' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    requireManager();
    $public = array_map('publicUser', loadUsers());
    respond(['ok' => true, 'users' => $public]);
}

if ($action === 'save_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $actor = requireManager();
    $in = body();
    $id = isset($in['id']) && $in['id'] !== '' ? (int)$in['id'] : 0;
    $username = trim((string)($in['username'] ?? ''));
    $password = (string)($in['password'] ?? '');
    $role = (string)($in['role'] ?? 'Üye');
    $status = (string)($in['status'] ?? 'Aktif');

    if ($username === '' || !in_array($role, ['Yönetici','Müdür','Üye'], true) || !in_array($status, ['Aktif','Pasif'], true)) {
        respond(['ok' => false, 'error' => 'Kullanıcı bilgileri eksik veya geçersiz.'], 422);
    }
    if ($id === 0 && strlen($password) < 4) respond(['ok' => false, 'error' => 'Şifre en az 4 karakter olmalıdır.'], 422);
    if ($actor['role'] === 'Müdür' && $role === 'Yönetici') respond(['ok' => false, 'error' => 'Müdür, Yönetici hesabı oluşturamaz.'], 403);

    $users = loadUsers();
    foreach ($users as $u) {
        if ((int)$u['id'] !== $id && lowerText((string)$u['username']) === lowerText($username)) {
            respond(['ok' => false, 'error' => 'Bu kullanıcı adı zaten mevcut.'], 409);
        }
    }

    if ($id > 0) {
        $found = false;
        foreach ($users as &$u) {
            if ((int)$u['id'] === $id) {
                $found = true;
                if (lowerText((string)$u['username']) === 'admin' && $status !== 'Aktif') {
                    respond(['ok' => false, 'error' => 'Ana Admin hesabı pasif yapılamaz.'], 422);
                }
                $u['username'] = $username;
                $u['role'] = $role;
                $u['status'] = $status;
                if ($password !== '') $u['password_hash'] = password_hash($password, PASSWORD_DEFAULT);
                break;
            }
        }
        unset($u);
        if (!$found) respond(['ok' => false, 'error' => 'Kullanıcı bulunamadı.'], 404);
    } else {
        $maxId = 0;
        foreach ($users as $u) $maxId = max($maxId, (int)$u['id']);
        $users[] = [
            'id' => $maxId + 1,
            'username' => $username,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'role' => $role,
            'status' => $status,
            'created' => date('d.m.Y H:i'),
        ];
    }
    saveUsers($users);
    respond(['ok' => true]);
}

if ($action === 'password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireManager();
    $in = body();
    $id = (int)($in['id'] ?? 0);
    $password = trim((string)($in['password'] ?? ''));
    if ($id < 1 || strlen($password) < 4) respond(['ok' => false, 'error' => 'Yeni şifre en az 4 karakter olmalıdır.'], 422);
    $users = loadUsers();
    $found = false;
    foreach ($users as &$u) {
        if ((int)$u['id'] === $id) {
            $u['password_hash'] = password_hash($password, PASSWORD_DEFAULT);
            $found = true;
            break;
        }
    }
    unset($u);
    if (!$found) respond(['ok' => false, 'error' => 'Kullanıcı bulunamadı.'], 404);
    saveUsers($users);
    respond(['ok' => true]);
}

if ($action === 'delete_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireManager();
    $in = body();
    $id = (int)($in['id'] ?? 0);
    $users = loadUsers();
    foreach ($users as $u) {
        if ((int)$u['id'] === $id && lowerText((string)$u['username']) === 'admin') {
            respond(['ok' => false, 'error' => 'Ana Admin kullanıcısı silinemez.'], 422);
        }
    }
    $new = array_values(array_filter($users, function($u) use ($id) { return (int)$u['id'] !== $id; }));
    if (count($new) === count($users)) respond(['ok' => false, 'error' => 'Kullanıcı bulunamadı.'], 404);
    saveUsers($new);
    respond(['ok' => true]);
}

if ($action === 'locations' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    requireLogin();
    respond(['ok' => true, 'locations' => loadLocations()]);
}

if ($action === 'save_location' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireManager();
    $in = body();
    $id = isset($in['id']) && $in['id'] !== '' ? (int)$in['id'] : 0;
    $name = trim((string)($in['name'] ?? ''));
    $location = trim((string)($in['location'] ?? ''));
    $note = trim((string)($in['note'] ?? ''));
    if ($name === '' || $location === '') respond(['ok' => false, 'error' => 'Konum adı ve konum bilgisi zorunludur.'], 422);
    if (strlen($name) > 100 || strlen($note) > 250) respond(['ok' => false, 'error' => 'Konum adı veya not çok uzun.'], 422);
    $locations = loadLocations();
    if ($id > 0) {
        $found = false;
        foreach ($locations as &$x) {
            if ((int)($x['id'] ?? 0) === $id) {
                $x['name'] = $name; $x['location'] = $location; $x['note'] = $note; $found = true; break;
            }
        }
        unset($x);
        if (!$found) respond(['ok' => false, 'error' => 'Konum bulunamadı.'], 404);
    } else {
        $maxId = 0; foreach ($locations as $x) $maxId = max($maxId, (int)($x['id'] ?? 0));
        $locations[] = ['id' => $maxId + 1, 'name' => $name, 'location' => $location, 'note' => $note, 'created' => date('d.m.Y')];
    }
    saveLocations($locations);
    respond(['ok' => true]);
}

if ($action === 'delete_location' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireManager();
    $in = body(); $id = (int)($in['id'] ?? 0);
    $locations = loadLocations();
    $new = array_values(array_filter($locations, function($x) use ($id) { return (int)($x['id'] ?? 0) !== $id; }));
    if (count($new) === count($locations)) respond(['ok' => false, 'error' => 'Konum bulunamadı.'], 404);
    saveLocations($new); respond(['ok' => true]);
}

respond(['ok' => false, 'error' => 'Geçersiz API isteği.'], 404);
