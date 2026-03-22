import { Routes } from '@angular/router';
import { Master } from './components/master/master';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { TaskDashboard } from './features/task-dashboard/task-dashboard';
import { SamplesDashboard } from './features/samples-dashboard/samples-dashboard';
import { SampleDetails } from './features/samples-dashboard/sample-details/sample-details';
import { ClearanceDashboard } from './features/clearance-dashboard/clearance-dashboard';

export const routes: Routes = [
    {
        path:'' , component:Master
    },
    {
        path:'login',component:Login
    },
    {
        path:'register',component:Register
    },
    {
        path: 'dashboard', component: TaskDashboard
    },
    {
        path:'dashboard/samples', component: SamplesDashboard
    },
    {
        path:'dashboard/samples/details', component: SampleDetails
    },
    {
        path:'dashboard/clearance', component: ClearanceDashboard
    },
    {
        path: '**', redirectTo: ''
    }
];
