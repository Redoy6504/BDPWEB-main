import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Shared/login/login.component';
import { CategoryComponent } from './Components/category/category.component';
import { ResponseComponent } from './Components/response/response.component';
import { AuthGuard } from './Shared/Services/auth.guard';
import { MenuComponent } from './Components/menu/menu.component';
import { MenuPermissionComponent } from './Components/menu-permission/menu-permission.component';
import { AspNetUsersComponent } from './Components/asp-net-users/asp-net-users.component';
import { AccessDeniedComponent } from './Shared/access-denied/access-denied.component';

import { FieldTypeComponent } from './Components/FieldType/FieldTypecomponent';

import { EditorComponent } from './Shared/editor/editor.component';
import { ServiceComponent } from './Components/service/service.component';
import { ComplainComponent } from './Components/complain/complain.component';
import { ServiceDetailComponent } from './Components/service-detail/service-detail.component';
import { TouristSpotComponent } from './Components/tourist-spot/tourist-spot.component';
import { UploadComponent } from './Components/upload/upload.component';
import { TouristTripComponent } from './Components/tourist-trip/tourist-trip.component';

export const routes: Routes = [
    { path: "", component: LoginComponent, title: "Log in- BDP User Panel" },
    { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard], title: "Dashboard | BDP ", },
    { path: "categories", component: CategoryComponent, canActivate: [AuthGuard], title: "Categories | BDP " },
    { path: "fieldTypes", component: FieldTypeComponent, canActivate: [AuthGuard], title: "FieldType | BDP " },
    { path: "services", component: ServiceComponent, canActivate: [AuthGuard], title: "Service | BDP" },
    
    { path: "complain", component: ComplainComponent, canActivate: [AuthGuard], title: "Complain | BDP" },
    { path: "upload", component: UploadComponent, title:"Upload | BDP"},
    
    { path: "touristspot", component: TouristSpotComponent, canActivate: [AuthGuard], title: "Tourist Spot | BDP" },
    { path: "touristtrip", component: TouristTripComponent, canActivate: [AuthGuard], title: "Tourist Trip | BDP" },

    { path: "services/:id", component: ServiceDetailComponent, canActivate: [AuthGuard], title: "Service Detail | BDP" },
    { path: "response", component: ResponseComponent, title: "Response | BDP " },
    { path: "menu", component: MenuComponent, canActivate: [AuthGuard], title: "Menu | BDP " },
    { path: "menuPermission", component: MenuPermissionComponent, canActivate: [AuthGuard], title: "MenuPermission | BDP " },
    { path: "users", component: AspNetUsersComponent, canActivate: [AuthGuard], title: "Users | BDP " },
    { path: "editor", component: EditorComponent, title: "Editor | BDP " },
    // Lazy loading the standalone component for transaction details
    { path: 'access-denied', component: AccessDeniedComponent, title: 'Access Denied' },
    { path: '**', redirectTo: '/access-denied' }
];
