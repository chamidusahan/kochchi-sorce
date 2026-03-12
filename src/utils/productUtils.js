const HOST = 'https://getspiceup.com/';
const BACKEND_PREFIX = '/backend';

export const BACKEND_BASE_URL = `${HOST}${BACKEND_PREFIX}`;
export const BACKEND_PUBLIC_BASE_URL = `${BACKEND_BASE_URL}/public`;
export const BACKEND_UPLOADS_BASE_URL = `${BACKEND_PUBLIC_BASE_URL}/uploads`;
export const BACKEND_PRODUCT_UPLOADS_URL = `${BACKEND_UPLOADS_BASE_URL}/products`;

const sanitizeSlashes = (value = '') => value.replace(/\\/g, '/');
const trimLeadingSlash = (value = '') => value.replace(/^\/+/, '');

export const ensureAbsoluteBackendUrl = (rawPath = '') => {
  const source = rawPath.trim();
  if (!source) {
    return BACKEND_BASE_URL;
  }

  if (/^https?:\/\//i.test(source)) {
    return source;
  }

  const normalized = source.startsWith('/') ? source : `/${source}`;
  if (normalized.startsWith('/backend')) {
    return `${HOST}${normalized}`;
  }

  return `${BACKEND_BASE_URL}${normalized}`;
};

export const buildProductImageUrl = (rawImage = '') => {
  const source = sanitizeSlashes(rawImage.trim());
  if (!source) {
    return '';
  }

  if (/^https?:\/\//i.test(source)) {
    return source;
  }

  let normalized = source.startsWith('/') ? source : `/${source}`;

  if (normalized.startsWith('//')) {
    normalized = normalized.replace(/^\/+/, '/');
  }

  if (normalized.startsWith('/backend/public/')) {
    return `${HOST}${normalized}`;
  }

  if (normalized.startsWith('/public/')) {
    return `${BACKEND_BASE_URL}${normalized}`;
  }

  if (normalized.startsWith('/backend/uploads/')) {
    const uploadsPath = normalized.replace('/backend/uploads', '/uploads');
    return `${BACKEND_PUBLIC_BASE_URL}${uploadsPath}`;
  }

  if (normalized.startsWith('/uploads/')) {
    return `${BACKEND_PUBLIC_BASE_URL}${normalized}`;
  }

  if (normalized.startsWith('/backend/')) {
    return `${HOST}${normalized}`;
  }

  const relative = trimLeadingSlash(normalized);

  if (relative.startsWith('uploads/')) {
    return `${BACKEND_PUBLIC_BASE_URL}/${relative}`;
  }

  if (relative.startsWith('products/')) {
    return `${BACKEND_PRODUCT_UPLOADS_URL}/${relative.replace(/^products\//, '')}`;
  }

  return `${BACKEND_PRODUCT_UPLOADS_URL}/${relative}`;
};

const parseNumber = (value, fallback = 0) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const mapActiveProducts = (items = []) =>
  items
    .filter((item) => (item.status || '').toLowerCase() !== 'inactive')
    .map((item) => {
      const price = parseNumber(item.price, 0);
      const stock = Math.max(0, Number.parseInt(item.stock, 10) || 0);

      return {
        id: item.id,
        name: item.name || 'Unnamed product',
        price,
        image: buildProductImageUrl(item.image || ''),
        description:
          item.description ||
          'Authentic flavors inspired by Sri Lankan heat and craftsmanship.',
        category: item.category || '',
        sku: item.sku || '',
        stock,
        raw: item,
      };
    });
