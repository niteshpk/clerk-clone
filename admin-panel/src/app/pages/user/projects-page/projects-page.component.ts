import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ClrConditionalModule,
  ClrDataModule,
  ClrModalModule,
  ClrFormsModule,
} from "@clr/angular";
import { ButtonComponent } from "@components/button/button.component";
import { ProjectService } from "@services/project/project.service";
import { Project } from "@models/project.model";
import { DatePipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DialogService } from "@services/dialog/dialog.service";
import { PaginationComponent } from "@components/pagination/pagination.component";
import { InputContainerComponent } from "@components/input-container/input-container.component";
import { ModalFormComponent } from "@components/modal-form/modal-form.component";
import { BaseComponent } from "@components/base/base.component";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-projects-page",
  standalone: true,
  imports: [
    CommonModule,
    ClrDataModule,
    ClrConditionalModule,
    ClrModalModule,
    ClrFormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    DatePipe,
    PaginationComponent,
    InputContainerComponent,
    ModalFormComponent,
  ],
  templateUrl: "./projects-page.component.html",
  styleUrls: ["./projects-page.component.scss"],
})
export class ProjectsPageComponent extends BaseComponent {
  projects: Project[] = [];
  selectedProject?: Project;
  modalOpen = false;
  isEditMode = false;
  currentPage = 1;
  pageSize = 15;

  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });

  constructor(
    private orgService: ProjectService,
    private dialogService: DialogService
  ) {
    super();
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.orgService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects) => {
        this.projects = projects;
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProjects();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadProjects();
  }

  onAddProject() {
    this.isEditMode = false;
    this.selectedProject = undefined;
    this.form.reset();
    this.modalOpen = true;
  }

  onEditProject(org: Project, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.isEditMode = true;
    this.selectedProject = org;
    this.form.patchValue({
      name: org.name,
    });
    this.modalOpen = true;
  }

  onDeleteProject(org: Project, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.dialogService
      .warning({
        title: "Delete Project",
        content: `Are you sure you want to delete ${org.name}?`,
        acceptText: "Delete",
        acceptType: "danger",
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.orgService
            .deleteProject(org.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.loadProjects();
            });
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value as Partial<Project>;

      if (this.isEditMode && this.selectedProject) {
        this.orgService
          .updateProject(this.selectedProject.id, formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.loadProjects();
            this.modalOpen = false;
          });
        return;
      }

      this.orgService
        .createProject(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadProjects();
          this.modalOpen = false;
        });
    }
  }

  onCancel() {
    this.modalOpen = false;
    this.form.reset();
  }
}
