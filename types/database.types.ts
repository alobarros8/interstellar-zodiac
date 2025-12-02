/**
 * Tipos de base de datos de Supabase
 * Define las interfaces TypeScript para las tablas de la base de datos
 */

/**
 * Tabla: theatre_functions
 * Almacena información sobre las funciones de teatro
 */
export interface TheatreFunction {
    id: number;
    nombre_funcion: string;
    descripcion_funcion: string | null;
    valor_entrada_funcion: number | null;
    imagen_funcion: string | null;
}

/**
 * Tabla: users
 * Almacena información de contacto de los usuarios
 */
export interface User {
    id: number;
    name_user: string;
    email_user: string | null;
    number_user: number | null;
}

/**
 * Tipo para insertar nuevas funciones de teatro
 */
export type TheatreFunctionInsert = Omit<TheatreFunction, 'id'>;

/**
 * Tipo para actualizar funciones de teatro
 */
export type TheatreFunctionUpdate = Partial<TheatreFunctionInsert>;

/**
 * Tipo para insertar nuevos usuarios
 */
export type UserInsert = Omit<User, 'id'>;

/**
 * Tipo para actualizar usuarios
 */
export type UserUpdate = Partial<UserInsert>;
