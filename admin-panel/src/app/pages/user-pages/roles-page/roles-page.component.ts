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
import { Org } from "@models/org.model";
import { OrgService } from "@services/org/org.service";
import { SelectOption } from "@app/models/common.model";
import { map } from "rxjs";

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
  ],
  templateUrl: "./roles-page.component.html",
  styleUrls: ["./roles-page.component.scss"],
})
export class RolesPageComponent {
  roles: Role[] = [];
  selectedRole?: Role;
  modalOpen = false;
  isEditMode = false;
  orgs: SelectOption[] = [];

  form = new FormGroup({
    role: new FormControl("", [Validators.required]),
    organization_id: new FormControl("", [Validators.required]),
  });

  constructor(
    private roleService: RoleService,
    private dialogService: DialogService,
    private orgService: OrgService
  ) {}

  ngOnInit() {
    this.loadRoles();
    this.loadOrganizations();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  loadOrganizations() {
    this.orgService
      .getOrgs()
      .pipe(
        map((orgs: Org[]) =>
          orgs.map((org: Org) => ({
            label: org.name,
            value: org.id.toString(),
          }))
        )
      )
      .subscribe((orgs: SelectOption[]) => {
        this.orgs = orgs;
      });
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
      organization_id: role.organization_id,
    });
    this.modalOpen = true;
  }

  onDeleteRole(role: Role, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.dialogService
      .warning({
        title: "Delete Roleanization",
        content: `Are you sure you want to delete ${role.role}?`,
        acceptText: "Delete",
        acceptType: "danger",
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.roleService.deleteRole(role.id).subscribe(() => {
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
          .subscribe(() => {
            this.loadRoles();
            this.modalOpen = false;
          });
        return;
      }

      this.roleService.createRole(formData).subscribe(() => {
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
