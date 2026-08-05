import { environment } from "../../environments/environment";

const base_url = environment.mediaUrlRemoto;
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
  img?: string;
     get imagenUrl(){

      if(!this.img){
        return `assets/img/no-image.jpg`;
      } else if(this.img.includes('https')){
        return this.img;
      } else if(this.img){
        return `${base_url}/pagos/${this.img}`;
      }else {
        return `${base_url}/pagos/no-image.jpg`;
      }

    }

}
