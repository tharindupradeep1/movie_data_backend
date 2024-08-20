
export class PageMetaDto{
    readonly currentPage: number;
    readonly pageSize: number;  
    readonly totalPages: number;
  
    constructor(currentPage: number, pageSize: number, totalPages: number) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.totalPages = totalPages;
    }
  
}