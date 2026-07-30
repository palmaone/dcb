import { hash, verify } from "@felix/argon2";
import { pgdb_client } from "../db/connection.ts";
import { Usuario, NuevoUsuario } from "../../../shared/models/Usuario.ts";

export async function loginUser(username: string, password: string): Promise<Usuario|null> {
  //fetch user data from db
  const userResult = await pgdb_client.queryObject<Usuario>`SELECT * FROM usuarios WHERE usuario = ${username}`

  if(!userResult.rows.length) {
    throw new Error("User not found");
  }

  const storedHash = userResult.rows[0].password;
  const approvedPass = await verify(storedHash, password);

  if(approvedPass){
    console.log("Login successful! 🎉"); 
    return userResult.rows[0]
  } 
  console.error("Unauthorized user");
  return null
}

export async function registerUser(userData: NuevoUsuario) {
  const hashedPassword = await hash(userData.password)

  const insertResult = await pgdb_client.queryObject<Usuario>`
    INSERT INTO usuarios 
      (nombre, apellido, username, password, telefono, email)
    VALUES (
      ${userData.nombre},
      ${userData.apellido},
      ${hashedPassword},
      ${userData.telefono},
      ${userData.email},
      ${userData.password}
    )
  `;
  const newUser = insertResult.rows[0]
  console.log(`Created user: ${newUser.username} (id: ${newUser.id})`);
  
}