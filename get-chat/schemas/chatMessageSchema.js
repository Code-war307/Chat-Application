import {z} from 'zod';

export const chatMessageSchema = z.object({
    content : z.string()
})
