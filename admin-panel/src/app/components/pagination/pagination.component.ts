import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClrDataModule } from "@clr/angular";

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [CommonModule, ClrDataModule],
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 15;
  @Input() pageSizeOptions: number[] = [15, 30, 50, 100];
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get firstItem(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get lastItem(): number {
    return Math.min(this.firstItem + this.pageSize, this.totalItems);
  }

  onPageSizeChange(event: any): void {
    const size = Number(event);
    this.pageSize = size;
    this.pageSizeChange.emit(size);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }
}
