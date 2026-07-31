export class User {
  constructor(
    public first_name: string,
    public last_name: string,
    public numdoc: string,
    public email: string,
    public telefono: string,
    public activo: boolean,
    public password?: string,
    public role?: 'PROPIETARIO' | 'ADMIN' | 'GUARDIA' | 'VISITA' ,
    public uid?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ){}

}
