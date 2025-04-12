import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import { RolesService, Role } from "../../services/roles.service";
import {
  PermissionsService,
  Permission,
  Module,
} from "../../services/permissions.service";

@Component({
  selector: "app-role-permissions",
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Role Permissions</h3>
      </div>
      <div class="card-block">
        <form #roleForm="ngForm" (ngSubmit)="onSave()">
          <div class="form-group">
            <label for="role">Select Role</label>
            <select
              id="role"
              class="form-control"
              [(ngModel)]="selectedRoleId"
              name="role"
              (change)="onRoleChange()"
            >
              <option value="">Select a role</option>
              <option *ngFor="let role of roles()" [value]="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div class="permissions-matrix" *ngIf="selectedRoleId">
            <table class="table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th *ngFor="let action of actions()">
                    {{ action | titlecase }}
                    <input
                      type="checkbox"
                      [checked]="isAllActionsSelected(action)"
                      (change)="toggleAllActions(action)"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let module of modules()">
                  <td>
                    {{ module.name }}
                    <input
                      type="checkbox"
                      [checked]="isAllModuleSelected(module.id)"
                      (change)="toggleAllModule(module.id)"
                    />
                  </td>
                  <td *ngFor="let action of actions()">
                    <input
                      type="checkbox"
                      [checked]="hasPermission(module.id, action)"
                      (change)="togglePermission(module.id, action)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="card-footer">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="!selectedRoleId"
            >
              Save
            </button>
            <button type="button" class="btn btn-outline" (click)="onCancel()">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .permissions-matrix {
        margin-top: 1rem;
      }
      table {
        width: 100%;
      }
      th,
      td {
        text-align: center;
      }
    `,
  ],
})
export class RolePermissionsComponent implements OnInit {
  roles = signal<Role[]>([]);
  modules = signal<Module[]>([]);
  actions = signal<string[]>([]);
  selectedRoleId = "";
  selectedPermissions = new Set<string>();

  constructor(
    private rolesService: RolesService,
    private permissionsService: PermissionsService
  ) {}

  ngOnInit() {
    this.roles.set(this.rolesService.getRoles());
    this.modules.set(this.permissionsService.getModules());
    this.actions.set(this.permissionsService.getActions());
  }

  onRoleChange() {
    if (!this.selectedRoleId) {
      this.selectedPermissions.clear();
      return;
    }

    const role = this.roles().find((r) => r.id === this.selectedRoleId);
    if (role) {
      this.selectedPermissions = new Set(role.permissions);
    }
  }

  hasPermission(moduleId: string, action: string): boolean {
    return this.selectedPermissions.has(`${moduleId}:${action}`);
  }

  togglePermission(moduleId: string, action: string) {
    const permission = `${moduleId}:${action}`;
    if (this.selectedPermissions.has(permission)) {
      this.selectedPermissions.delete(permission);
    } else {
      this.selectedPermissions.add(permission);
    }
  }

  isAllModuleSelected(moduleId: string): boolean {
    return this.actions().every((action) =>
      this.selectedPermissions.has(`${moduleId}:${action}`)
    );
  }

  toggleAllModule(moduleId: string) {
    const allSelected = this.isAllModuleSelected(moduleId);
    this.actions().forEach((action) => {
      const permission = `${moduleId}:${action}`;
      if (allSelected) {
        this.selectedPermissions.delete(permission);
      } else {
        this.selectedPermissions.add(permission);
      }
    });
  }

  isAllActionsSelected(action: string): boolean {
    return this.modules().every((module) =>
      this.selectedPermissions.has(`${module.id}:${action}`)
    );
  }

  toggleAllActions(action: string) {
    const allSelected = this.isAllActionsSelected(action);
    this.modules().forEach((module) => {
      const permission = `${module.id}:${action}`;
      if (allSelected) {
        this.selectedPermissions.delete(permission);
      } else {
        this.selectedPermissions.add(permission);
      }
    });
  }

  async onSave() {
    if (!this.selectedRoleId) return;

    await this.rolesService.saveRolePermissions(
      this.selectedRoleId,
      Array.from(this.selectedPermissions)
    );
  }

  onCancel() {
    this.selectedRoleId = "";
    this.selectedPermissions.clear();
  }
}
