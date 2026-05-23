import type { AppConfig } from '@nodejs-study/config'
import { Worker } from 'bullmq'
import { queueNames, type InvitationEmailJob } from './queues'
import { redisConnectionFromUrl } from './redis'

export function createInvitationEmailWorker(config: AppConfig): Worker<InvitationEmailJob> {
  return new Worker<InvitationEmailJob>(
    queueNames.invitationEmail,
    async (job) => {
      return {
        delivered: true,
        invitationId: job.data.invitationId,
      }
    },
    {
      connection: redisConnectionFromUrl(config.redisUrl),
    },
  )
}
