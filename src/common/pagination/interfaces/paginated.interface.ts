export interface Paginated<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    last: string;
    current: string;
    previous: string;
    next: string;
  };
}
