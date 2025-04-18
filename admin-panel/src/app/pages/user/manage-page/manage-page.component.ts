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
import { combineLatest, finalize, Observable, takeUntil } from "rxjs";
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
  hasChanges = false;
  projectId: string = "";
  projectControl = new FormControl("");
  projects: SelectOption[] = [];

  form: FormGroup = new FormGroup({
    projectId: new FormControl(""),
    roles: new FormArray([]),
  });

  get rolesFA() {
    return this.form.get("roles") as FormArray;
  }

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.roles$ = this.roleService.getRoles();
    this.permissions$ = this.permissionService.getPermissions();
  }

  ngOnInit() {
    this.setLoading(true);

    this.projectService
      .getProjects()
      .pipe(finalize(() => this.setLoading(false)))
      .subscribe((projects) => {
        this.projects = projects.map((project) => ({
          label: project.name,
          value: project.id.toString(),
        }));
      });

    this.route.params.subscribe((params) => {
      this.projectId = params["projectId"];
      if (this.projectControl.getRawValue() !== this.projectId) {
        this.projectControl.patchValue(this.projectId);
      }
      this.form.get("projectId")?.patchValue(this.projectId);
      this.setLoading(true);
      combineLatest([this.roles$, this.permissions$])
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(([roles, permissions]) => {
          this.patchForm(roles, permissions);
        });
    });

    // Subscribe to form value changes to track modifications
    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.hasChanges = true;
    });
  }

  patchForm(roles: Role[], permissions: Permission[]) {
    // Clear existing form array
    while (this.rolesFA.length) {
      this.rolesFA.removeAt(0);
    }

    // Create form groups for each role
    roles.forEach((role) => {
      const roleForm = new FormGroup({
        roleId: new FormControl(role.id),
        permissions: new FormArray(
          permissions.map((permission) => {
            return new FormGroup({
              permissionId: new FormControl(permission.id),
              isChecked: new FormControl(false),
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
    const roleGroup = this.rolesFA.at(roleIndex) as FormGroup;
    const permissionsArray = roleGroup.get("permissions") as FormArray;
    const permissionGroup = permissionsArray.at(permissionIndex) as FormGroup;
    return permissionGroup.get("isChecked") as FormControl;
  }

  onProjectChange(event: any) {
    const projectId = event?.target?.value;
    this.router.navigateByUrl(`/user/manage-page/${projectId}`);
  }

  onSave() {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      console.log("Saving form data:", JSON.stringify(formData));
      // TODO: Implement save logic
      this.hasChanges = false;
    }
  }

  onCancel() {
    this.form.reset();
    this.hasChanges = false;
  }
}
