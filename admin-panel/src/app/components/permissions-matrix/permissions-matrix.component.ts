import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import { Observable, combineLatest, takeUntil } from "rxjs";
import { BaseComponent } from "../base/base.component";
import { RoleService } from "@services/role/role.service";
import { PermissionService } from "@services/permission/permission.service";
import { Role } from "@models/role.model";
import { Permission } from "@models/permission.model";

@Component({
  selector: "app-permissions-matrix",
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule],
  templateUrl: "./permissions-matrix.component.html",
  styleUrls: ["./permissions-matrix.component.scss"],
})
export class PermissionsMatrixComponent
  extends BaseComponent
  implements OnInit
{
  roles$: Observable<Role[]>;
  permissions$: Observable<Permission[]>;
  private originalPermissions: { [roleId: number]: number[] } = {};
  private currentPermissions: { [roleId: number]: number[] } = {};
  hasChanges = false;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {
    super();
    this.roles$ = this.roleService.getRoles();
    this.permissions$ = this.permissionService.getPermissions();
  }

  ngOnInit() {
    combineLatest([this.roles$, this.permissions$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([roles]) => {
        this.originalPermissions = roles.reduce((acc, role) => {
          acc[role.id] = [];
          return acc;
        }, {} as { [roleId: number]: number[] });
        this.currentPermissions = { ...this.originalPermissions };
        this.checkForChanges();
      });
  }

  hasPermission(role: Role, permissionId: number): boolean {
    return this.currentPermissions[role.id]?.includes(permissionId) || false;
  }

  togglePermission(roleId: number, permissionId: number) {
    if (!this.currentPermissions[roleId]) {
      this.currentPermissions[roleId] = [];
    }

    const index = this.currentPermissions[roleId].indexOf(permissionId);
    if (index === -1) {
      this.currentPermissions[roleId].push(permissionId);
    } else {
      this.currentPermissions[roleId].splice(index, 1);
    }

    this.checkForChanges();
  }

  private checkForChanges() {
    this.hasChanges = Object.keys(this.originalPermissions).some((roleId) => {
      const original = (this.originalPermissions[+roleId] || []).sort();
      const current = (this.currentPermissions[+roleId] || []).sort();
      return JSON.stringify(original) !== JSON.stringify(current);
    });
  }

  onSave() {
    const data = Object.entries(this.currentPermissions).reduce(
      (acc, [roleId, permissions]) => {
        acc[+roleId] = permissions || [];
        return acc;
      },
      {} as { [roleId: number]: number[] }
    );

    // TODO: Implement save method in RoleService
    // this.roleService.savePermissionsMatrix(data)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: () => {
    //       this.originalPermissions = { ...this.currentPermissions };
    //       this.checkForChanges();
    //     },
    //     error: (error: Error) => {
    //       console.error("Failed to save permissions:", error);
    //     },
    //   });
  }

  onCancel() {
    this.currentPermissions = { ...this.originalPermissions };
    this.checkForChanges();
  }
}
