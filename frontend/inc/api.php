<?php

define('API_BASE', 'https://api.sobhaproperties.in');

function api_get(string $path): ?array
{
    $ch = curl_init(API_BASE . $path);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $response = curl_exec($ch);
    $error = curl_error($ch);

    if ($response === false || $error) {
        return null;
    }

    $data = json_decode($response, true);
    return is_array($data) ? $data : null;
}

function fetch_projects(): array
{
    $result = api_get('/api/v1/projects');
    if (!$result || empty($result['success'])) {
        return [];
    }
    return $result['data'] ?? [];
}

function fetch_project_by_slug(string $slug): ?array
{
    $result = api_get('/api/v1/projects/slug/' . rawurlencode($slug));
    if (!$result || empty($result['success'])) {
        return null;
    }
    return $result['data'] ?? null;
}

function fetch_blogs(): array
{
    $result = api_get('/api/v1/blogs');
    if (!$result || empty($result['success'])) {
        return [];
    }
    return $result['data'] ?? [];
}

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

function project_url(array $project): string
{
    return '/bangalore/' . rawurlencode($project['slug'] ?? '');
}

function truncate_text(string $text, int $length): string
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($text) > $length ? mb_substr($text, 0, $length) . '...' : $text;
    }
    return strlen($text) > $length ? substr($text, 0, $length) . '...' : $text;
}
