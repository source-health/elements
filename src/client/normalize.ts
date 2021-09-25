type ResourceMap = Record<string, Record<string, unknown>>
type Normalized = {
  result: unknown
  resources: ResourceMap
}

interface Resource {
  object: string
  id: string
}

function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null
}

function isResource(input: unknown): input is Resource {
  return isObject(input) && typeof input.object === 'string' && typeof input.id === 'string'
}

function normalizeInternal(input: unknown, map: ResourceMap): unknown {
  if (isResource(input)) {
    map[input.object] ||= {}

    if (!map[input.object][input.id]) {
      map[input.object][input.id] = Object.fromEntries(
        Object.entries(input).map(([key, value]) => [key, normalizeInternal(value, map)]),
      )
    }

    return input.id
  } else if (Array.isArray(input)) {
    return input.map((item) => normalizeInternal(item, map))
  } else if (isObject(input)) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, normalizeInternal(value, map)]),
    )
  } else {
    return input
  }
}

export function normalize(input: unknown): Normalized {
  const resources: ResourceMap = {}
  const response = normalizeInternal(input, resources)

  return {
    result: response,
    resources: resources,
  }
}
