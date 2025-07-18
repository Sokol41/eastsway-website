export async function onRequest(context) {
  const response = await context.next();  // Получаем оригинальный ответ от Pages

  // Удаляем палевные заголовки (максимум возможного)
  response.headers.delete('Server');  // Пытаемся удалить, но Cloudflare может перезаписать
  response.headers.delete('cf-ray');
  response.headers.delete('cf-cache-status');
  response.headers.delete('report-to');
  response.headers.delete('nel');
  response.headers.delete('x-content-type-options');  // Если не нужен
  response.headers.delete('referrer-policy');  // Если не нужен

  // Добавляем кастомные заголовки для маскировки
  response.headers.set('X-Powered-By', 'Custom-Engine');
  response.headers.set('X-Server', 'nginx/1.18.0');  // Workaround: имитируем Server (виден в curl, маскирует cloudflare)

  // Тестовый маркер для проверки
  response.headers.set('X-Test-Functions', 'Updated-Active');

  return response;
}
