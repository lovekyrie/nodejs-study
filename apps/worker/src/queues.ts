export const queueNames = {
  invitationEmail: 'invitation-email',
  auditLog: 'audit-log',
} as const

export type QueueName = (typeof queueNames)[keyof typeof queueNames]

export interface InvitationEmailJob {
  invitationId: string
  organizationId: string
  email: string
  token: string
}

export interface AuditLogJob {
  organizationId: string
  actorId: string | null
  action: string
  targetType: string
  targetId: string | null
  metadata?: Record<string, unknown>
}

export function buildJobId(queueName: QueueName, entityId: string): string {
  return `${queueName}:${entityId}`
}
