export async function onRequest(context) {
  const response = await context.next();  // Получаем оригинальный ответ от Pages

  // Удаляем палевные заголовки (пример для Cloudflare/GitHub)
  response.headers.delete('Server');
  response.headers.delete('cf-ray');
  response.headers.delete('cf-cache-status');
  response.headers.delete('report-to');
  response.headers.delete('nel');
  response.headers.delete('x-github-request-id');  // Если остались следы GitHub

  // Добавляем кастомные заголовки для маскировки
  response.headers.set('Server', 'nginx/1.18.0');
  response.headers.set('X-Powered-By', 'Custom-Engine');
  response.headers.set('X-Server', 'nginx/1.18.0');  // Workaround для имитации nginx

  return response;
}
