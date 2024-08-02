import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent {
  users  : any[] = [];
  filteredUsers: any[] = [];

  constructor( private toastr: ToastrService, private userService : UserService){}
  @Input() filteredWord : string = '';

  ngOnInit(): void {
    this.loadUsers();
  }
  
   
  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(event => event.title.toLowerCase().includes(this.filteredWord.toLowerCase()));
  }
  
  deleteSurvey(id: number): void {
    if(window.confirm("¿Desea eliminar el Usuario?")){
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers(); 
        });
      this.toastr.success("Uusario Eliminada con Exito");
    }else{
      return;
    }
  }
  
}
