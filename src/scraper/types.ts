export type SERPSnapshot = {
  keyword: string
  position: number | null
  title: string | null
  url: string | null
  description: string | null
  rating: number | null
  total_results: number | null
  scraped_at: string
}

export type GoogleOrganicResult = {
  pos?: number
  title?: string
  url?: string
  desc?: string
  rating?: number
  currency?: string
  price_lower?: number
  price_upper?: number
  favicon_text?: string
  images?: string[]
  additional_info?: string[]
}

export type GoogleResponse = {
  results?: GoogleWrappedResult[] | GoogleDirectResult
  errors?: unknown[]
}

export type GoogleWrappedResult = {
  content?: { results?: GoogleDirectResult }
}

export type GoogleDirectResult = {
  organic?: GoogleOrganicResult[]
  paid?: unknown[]
  featured_snippet?: unknown
  related_searches?: unknown
  top_stories?: unknown
  search_information?: {
    total_results?: number
    query?: string
  }
}
