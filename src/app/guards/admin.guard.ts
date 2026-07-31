import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * 1. GUARD GLOBAL DE AUTENTICACIÓN
 * Verifica únicamente si el usuario ha iniciado sesión.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.validarToken().pipe(
    map((autenticado: boolean) => {
      if (autenticado) return true;

      // Plan B: Validar localStorage si el token falló temporalmente
      const localAuth = localStorage.getItem('estaAutenticado') === 'true';
      if (localAuth) return true;

      // Si no está autenticado, redirigir al login
      return router.createUrlTree(['/login']);
    }),
    catchError(() => {
      // Manejo de error de red: Plan B con localStorage
      const localAuth = localStorage.getItem('estaAutenticado') === 'true';
      return of(localAuth ? true : router.createUrlTree(['/login']));
    })
  );
};

/**
 * 2. GUARD EXCLUSIVO PARA ROLES
 * Valida si el usuario autenticado tiene permitido entrar a la ruta según su rol.
 */
export const rolGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 🌟 CORRECCIÓN 3: Cambia 'rol' por 'role' para leer el localStorage correctamente
  const rolUsuario = localStorage.getItem('role'); 

  // Captura el arreglo de roles permitidos de la ruta (ej: ['PROPIETARIO'])
  const rolesPermitidos = route.data['roles'] as Array<string>;

  // Si el rol existe en el localStorage y está autorizado en la ruta, permitimos el paso
  if (rolUsuario && rolesPermitidos.includes(rolUsuario)) {
    return true; 
  }

  // Si el Guard rechaza la entrada, redirige de forma inteligente según su rol real
  if (rolUsuario === 'PROPIETARIO') {
    return router.createUrlTree(['/propietario/inicio']);
  } else if (rolUsuario === 'GUARDIA') {
    return router.createUrlTree(['/guardia/dashboard']);
  }

  return router.createUrlTree(['/login']);
};

