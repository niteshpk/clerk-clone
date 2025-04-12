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
  ],
  templateUrl: "./projects-page.component.html",
  styleUrls: ["./projects-page.component.scss"],
})
export class ProjectsPageComponent {
  projects: Project[] = [];
  selectedProject?: Project;
  modalOpen = false;
  isEditMode = false;

  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });

  constructor(
    private orgService: ProjectService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.orgService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
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
      .subscribe((confirmed) => {
        if (confirmed) {
          this.orgService.deleteProject(org.id).subscribe(() => {
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
          .subscribe(() => {
            this.loadProjects();
            this.modalOpen = false;
          });
        return;
      }

      this.orgService.createProject(formData).subscribe(() => {
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
