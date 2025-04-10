import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ClrConditionalModule,
  ClrDataModule,
  ClrModalModule,
  ClrFormsModule,
} from "@clr/angular";
import { ButtonComponent } from "@components/button/button.component";
import { OrgService } from "@services/org/org.service";
import { Org } from "@models/org.model";
import { DatePipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DialogService } from "@services/dialog/dialog.service";

@Component({
  selector: "app-orgs-page",
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
  templateUrl: "./orgs-page.component.html",
  styleUrls: ["./orgs-page.component.scss"],
})
export class OrgsPageComponent {
  orgs: Org[] = [];
  selectedOrg?: Org;
  modalOpen = false;
  isEditMode = false;

  form = new FormGroup({
    name: new FormControl("", [Validators.required]),
  });

  constructor(
    private orgService: OrgService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadOrgs();
  }

  loadOrgs() {
    this.orgService.getOrgs().subscribe((orgs) => {
      this.orgs = orgs;
    });
  }

  onAddOrg() {
    this.isEditMode = false;
    this.selectedOrg = undefined;
    this.form.reset();
    this.modalOpen = true;
  }

  onEditOrg(org: Org, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.isEditMode = true;
    this.selectedOrg = org;
    this.form.patchValue({
      name: org.name,
    });
    this.modalOpen = true;
  }

  onDeleteOrg(org: Org, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.dialogService
      .warning({
        title: "Delete Organization",
        content: `Are you sure you want to delete ${org.name}?`,
        acceptText: "Delete",
        acceptType: "danger",
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.orgService.deleteOrg(org.id).subscribe(() => {
            this.loadOrgs();
          });
        }
      });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value as Partial<Org>;

      if (this.isEditMode && this.selectedOrg) {
        this.orgService
          .updateOrg(this.selectedOrg.id, formData)
          .subscribe(() => {
            this.loadOrgs();
            this.modalOpen = false;
          });
        return;
      }

      this.orgService.createOrg(formData).subscribe(() => {
        this.loadOrgs();
        this.modalOpen = false;
      });
    }
  }

  onCancel() {
    this.modalOpen = false;
    this.form.reset();
  }
}
