import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  Form,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import {
  BehaviorSubject,
  combineLatest,
  finalize,
  Observable,
  takeUntil,
} from "rxjs";
import { RoleService } from "@services/role/role.service";
import { PermissionService } from "@services/permission/permission.service";
import { Role } from "@models/role.model";
import { Permission } from "@models/permission.model";
import { ActivatedRoute, Router } from "@angular/router";
import { SelectContainerComponent } from "@components/select-container/select-container.component";
import { SelectOption } from "@models/common.model";
import { ProjectService } from "@services/project/project.service";
import { SpinnerComponent } from "@components/spinner/spinner.component";
import { BaseComponent } from "@components/base-component/base-component.component";
import { ManageService } from "@services/manage/manage.service";

@Component({
  selector: "app-manage-page",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    SelectContainerComponent,
    SpinnerComponent,
  ],
  templateUrl: "./manage-page.component.html",
  styleUrls: ["./manage-page.component.scss"],
})
export class ManagePageComponent extends BaseComponent implements OnInit {
  roles$: Observable<Role[]>;
  permissions$: Observable<Permission[]>;
  projectId$ = new BehaviorSubject<string>("");
  projectControl = new FormControl("");
  projects: SelectOption[] = [];
  defaultControl = new FormControl(false);

  form: FormGroup = new FormGroup({
    roles: new FormArray([]),
  });

  get rolesFA() {
    return this.form.get("roles") as FormArray;
  }

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private projectService: ProjectService,
    private manageService: ManageService
  ) {
    super();
    this.roles$ = this.roleService.getRoles();
    this.permissions$ = this.permissionService.getPermissions();
  }

  ngOnInit() {
    combineLatest([
      this.projectService.getProjects(),
      this.roles$,
      this.permissions$,
    ])
      .pipe(
        takeUntil(this.onDestroy$),
        finalize(() => this.setLoading(false))
      )
      .subscribe(([projects, roles, permissions]) => {
        console.log(projects, roles, permissions);
        // Update projects
        this.projects = projects.map((project) => ({
          label: project.name,
          value: project.id.toString(),
        }));
        this.onProjectChange({ target: { value: this.projects[0].value } });
      });
  }

  patchForm(permissions: any) {
    // Clear existing form array
    while (this.rolesFA.length) {
      this.rolesFA.removeAt(0);
    }

    // Create form groups for each role
    permissions.forEach((role: any) => {
      const roleForm = new FormGroup({
        roleId: new FormControl(role.roleId),
        permissions: new FormArray(
          role.permissions.map((permission: any) => {
            console.log(permission, "----");
            return new FormGroup({
              permissionId: new FormControl(permission.permissionId),
              isChecked: new FormControl(!!permission.isChecked),
              permissionName: new FormControl(permission.permissionName),
            });
          })
        ),
      });

      this.rolesFA.push(roleForm);
    });
  }

  getPermissionControl(
    roleIndex: number,
    permissionIndex: number
  ): FormControl {
    try {
      const roleGroup = this.rolesFA?.at(roleIndex) as FormGroup;
      if (!roleGroup) return this.defaultControl;

      const permissionsArray = roleGroup.get("permissions") as FormArray;
      if (!permissionsArray) return this.defaultControl;

      const permissionGroup = permissionsArray.at(permissionIndex) as FormGroup;
      if (!permissionGroup) return this.defaultControl;

      const control = permissionGroup.get("isChecked") as FormControl;
      return control || this.defaultControl;
    } catch (error) {
      console.error("Error accessing form control:", error);
      return this.defaultControl;
    }
  }

  onProjectChange(event: any) {
    const projectId = event?.target?.value;

    // Handle project selection
    this.projectId$.next(projectId);

    if (this.projectControl.getRawValue() !== this.projectId$.value) {
      this.projectControl.patchValue(this.projectId$.value);
    }

    // Get and patch permissions
    if (this.projectId$.value) {
      this.manageService
        .getProjectPermissions(projectId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((projectPermissions) => {
          console.log(projectPermissions);
          this.patchForm(projectPermissions);
        });
    }
  }

  onSave() {
    if (this.form.valid) {
      const formData = this.form.get("roles")?.getRawValue();
      console.log("Saving form data:", JSON.stringify(formData));

      this.manageService
        .updateProjectPermissions(this.projectId$.value, formData)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((updatedPermissions) => {
          console.log("Updated permissions:", updatedPermissions);
        });
    }
  }

  onCancel() {
    this.form.reset();
  }
}
