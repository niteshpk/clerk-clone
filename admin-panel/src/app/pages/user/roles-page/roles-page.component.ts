import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ClrConditionalModule,
  ClrDataModule,
  ClrModalModule,
  ClrFormsModule,
} from "@clr/angular";
import { ButtonComponent } from "@components/button/button.component";
import { RoleService } from "@services/role/role.service";
import { Role } from "@models/role.model";
import { DatePipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DialogService } from "@services/dialog/dialog.service";
import { Project } from "@models/project.model";
import { ProjectService } from "@services/project/project.service";
import { SelectOption } from "@models/common.model";
import { map } from "rxjs";
import { PaginationComponent } from "@components/pagination/pagination.component";
import { InputContainerComponent } from "@components/input-container/input-container.component";
import { SelectContainerComponent } from "@components/select-container/select-container.component";
import { ModalFormComponent } from "@components/modal-form/modal-form.component";
import { BaseComponent } from "@components/base/base.component";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-roles-page",
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
    SelectContainerComponent,
    ModalFormComponent,
  ],
  templateUrl: "./roles-page.component.html",
  styleUrls: ["./roles-page.component.scss"],
})
export class RolesPageComponent extends BaseComponent {
  roles: Role[] = [];
  selectedRole?: Role;
  modalOpen = false;
  isEditMode = false;
  projects: SelectOption[] = [];
  currentPage = 1;
  pageSize = 15;

  form = new FormGroup({
    role: new FormControl("", [Validators.required]),
    project_id: new FormControl("", [Validators.required]),
  });

  constructor(
    private roleService: RoleService,
    private dialogService: DialogService,
    private projectService: ProjectService
  ) {
    super();
  }

  ngOnInit() {
    this.loadRoles();
    this.loadProjects();
  }

  loadRoles() {
    this.roleService
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe((roles) => {
        this.roles = roles;
      });
  }

  loadProjects() {
    this.projectService
      .getProjects()
      .pipe(
        map((projects: Project[]) =>
          projects.map((project: Project) => ({
            label: project.name,
            value: project.id.toString(),
          }))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((projects: SelectOption[]) => {
        this.projects = projects;
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadRoles();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadRoles();
  }

  onAddRole() {
    this.isEditMode = false;
    this.selectedRole = undefined;
    this.form.reset();
    this.modalOpen = true;
  }

  onEditRole(role: Role, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.isEditMode = true;
    this.selectedRole = role;
    this.form.patchValue({
      role: role.role,
      project_id: role.project_id,
    });
    this.modalOpen = true;
  }

  onDeleteRole(role: Role, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.dialogService
      .warning({
        title: "Delete Role",
        content: `Are you sure you want to delete ${role.role}?`,
        acceptText: "Delete",
        acceptType: "danger",
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.roleService
            .deleteRole(role.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.loadRoles();
            });
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value as Partial<Role>;

      if (this.isEditMode && this.selectedRole) {
        this.roleService
          .updateRole(this.selectedRole.id, formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.loadRoles();
            this.modalOpen = false;
          });
        return;
      }

      this.roleService
        .createRole(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadRoles();
          this.modalOpen = false;
        });
    }
  }

  onCancel() {
    this.modalOpen = false;
    this.form.reset();
  }
}
