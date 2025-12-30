import { Router } from 'express';
import { supabase } from '../supabase';
import { z } from 'zod';
 
const router = Router();
 
const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['Pending', 'Completed'])
});
 
// CREATE
router.post('/', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
 
  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }
 
  const { error } = await supabase.from('tasks').insert({
    ...result.data,
    user_id: userId
  });
 
  if (error) return res.status(500).json({ error });
  res.json({ message: 'Task created' });
});
 
// READ
router.get('/', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
 
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);
 
  if (error) return res.status(500).json({ error });
  res.json(data);
});
 
// UPDATE
router.put('/:id', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;
 
  const { error } = await supabase
    .from('tasks')
    .update(req.body)
    .eq('id', id)
    .eq('user_id', userId);
 
  if (error) return res.status(500).json({ error });
  res.json({ message: 'Task updated' });
});
 
// DELETE
router.delete('/:id', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { id } = req.params;
 
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
 
  if (error) return res.status(500).json({ error });
  res.json({ message: 'Task deleted' });
});
 
export default router;