/**
 * Barreira de proteção "falsa" (mock) para as áreas internas do Clinix
 * (doctor, admin, reception, clinix).
 *
 * Enquanto o back-end real de autenticação não está pronto, cada área
 * só pode ser acessada se o usuário tiver passado pela tela de login
 * daquela área (ainda que o login em si seja simulado). O acesso direto
 * pela URL (ex: doctor.localhost sem antes logar) é bloqueado e o
 * usuário é redirecionado para a tela de autenticação correspondente.
 *
 * Isso é só uma barreira de UX/roteamento — não é segurança real.
 * Quando o back-end estiver pronto, troque isso por um guard baseado
 * em token/JWT validado no servidor.
 */

export type Role = 'doctor' | 'admin' | 'reception' | 'clinix';

const ACCESS_PREFIX = 'clinix_access_';

/** Chamado pela tela de login (mock) ao "autenticar" com sucesso. */
export function grantAccess(role: Role): void {
  sessionStorage.setItem(ACCESS_PREFIX + role, '1');
}

/** Revoga o acesso concedido (ex: em um logout). */
export function revokeAccess(role: Role): void {
  sessionStorage.removeItem(ACCESS_PREFIX + role);
}

/** Verifica se o acesso à área foi concedido nesta sessão. */
export function hasAccess(role: Role): boolean {
  return sessionStorage.getItem(ACCESS_PREFIX + role) === '1';
}

/**
 * Bloqueia o acesso direto à área "role".
 * Se não houver acesso concedido, redireciona para authPath
 * (por padrão "/auth" dentro do próprio subdomínio da área) e
 * retorna false — o chamador não deve renderizar a aplicação nesse caso.
 */
export function requireAccess(role: Role, authPath: string = '/auth'): boolean {
  if (!hasAccess(role)) {
    window.location.replace(authPath);
    return false;
  }
  return true;
}
