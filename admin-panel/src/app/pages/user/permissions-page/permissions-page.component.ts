import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ClrConditionalModule,
  ClrDataModule,
  ClrModalModule,
  ClrFormsModule,
} from "@clr/angular";
import { ButtonComponent } from "@components/button/button.component";
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
import { PermissionService } from "@services/permission/permission.service";
import { Permission } from "@models/permission.model";
import { PaginationComponent } from "@components/pagination/pagination.component";
import { InputContainerComponent } from "@components/input-container/input-container.component";
import { SelectContainerComponent } from "@components/select-container/select-container.component";
import { ModalFormComponent } from "@components/modal-form/modal-form.component";
import { BaseComponent } from "@components/base-component/base-component.component";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-permissions-page",
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
  templateUrl: "./permissions-page.component.html",
  styleUrls: ["./permissions-page.component.scss"],
})
export class PermissionsPageComponent extends BaseComponent {
  permissions: Permission[] = [];
  selectedPermission?: Permission;
  modalOpen = false;
  isEditMode = false;
  projects: SelectOption[] = [];
  currentPage = 1;
  pageSize = 15;

  form = new FormGroup({
    permission: new FormControl("", [Validators.required]),
    project_id: new FormControl("", [Validators.required]),
  });

  constructor(
    private permissionService: PermissionService,
    private dialogService: DialogService,
    private projectService: ProjectService
  ) {
    super();
  }

  ngOnInit() {
    this.loadPermissions();
    this.loadProjects();
  }

  loadPermissions() {
    this.permissionService
      .getPermissions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((permissions) => {
        this.permissions = permissions;
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
        takeUntil(this.onDestroy$)
      )
      .subscribe((projects: SelectOption[]) => {
        this.projects = projects;
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPermissions();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadPermissions();
  }

  onAddPermission() {
    this.isEditMode = false;
    this.selectedPermission = undefined;
    this.form.reset();
    this.modalOpen = true;
  }

  onEditPermission(permission: Permission, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.isEditMode = true;
    this.selectedPermission = permission;
    this.form.patchValue({
      permission: permission.permission,
      project_id: permission.project_id,
    });
    this.modalOpen = true;
  }

  onDeletePermission(permission: Permission, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.dialogService
      .warning({
        title: "Delete Permission",
        content: `Are you sure you want to delete ${permission.permission}?`,
        acceptText: "Delete",
        acceptType: "danger",
      })
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.permissionService
            .deletePermission(permission.id)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
              this.loadPermissions();
            });
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value as Partial<Permission>;

      if (this.isEditMode && this.selectedPermission) {
        this.permissionService
          .updatePermission(this.selectedPermission.id, formData)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe(() => {
            this.loadPermissions();
            this.modalOpen = false;
          });
        return;
      }

      this.permissionService
        .createPermission(formData)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          this.loadPermissions();
          this.modalOpen = false;
        });
    }
  }

  onCancel() {
    this.modalOpen = false;
    this.form.reset();
  }
}
