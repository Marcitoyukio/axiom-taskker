/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource("/teams", "TeamsController").apiOnly()
  Route.resource("/users", "UsersController").apiOnly()
  Route.resource("/tasks", "TasksController").apiOnly()
  Route.resource("/activities", "ActivitiesController").apiOnly()
  Route.resource("/messages", "MessagesController").apiOnly()

  Route.get("/users/getUserByEmail/:email", 'UsersController.getUserByEmail')

  Route.patch('/updateTaskStatus/:id', 'TasksController.updateTaskStatus')
  Route.patch('/updateActivityStatus/:id', 'ActivitiesController.updateActivityStatus')

  Route.post('/createUserTeamLink', 'UserTeamsController.store')
  Route.delete('/deleteUserTeamLink/:user_id/:team_id', 'UserTeamsController.destroy')
  Route.get('/getTeamsByUser/:user_id', 'UserTeamsController.getTeamsByUser')
  Route.get('/getUsersByTeam/:team_id', 'UserTeamsController.getUsersByTeam')
  Route.delete('/removeUserTeams/:user_id', 'UserTeamsController.removeUserTeams')

  Route.get('/getTaskByTeam/:team_id', "TasksController.getTaskByTeam") 
  Route.get('/getTaskByName/:team_id/:task_name', "TasksController.getTaskByName") 

  Route.post('/createTaskUserLink', 'TaskUsersController.store')
  Route.delete('/deleteTaskUserLink/:task_id/:user_id', 'TaskUsersController.destroy')
  Route.get('/getUsersByTasks/:task_id', 'TaskUsersController.getUsersByTasks')
  Route.get('/getUserMostRecentTask/:user_id', 'TaskUsersController.getUserMostRecentTask')
  Route.delete('/removeTaskUsers/:task_id','TaskUsersController.removeTaskUsers')

  Route.post('/createActivityUserLink', 'ActivityUsersController.store')
  Route.delete('/deleteActivityUserLink/:activity_id/:user_id', 'ActivityUsersController.destroy')
  Route.get('/getUsersByActivities/:activity_id', 'ActivityUsersController.getUsersByActivities')
  Route.delete('/removeActivityUsers/:activity_id','ActivityUsersController.removeActivityUsers')
  Route.get('/getActivityByTask/:task_id', "ActivitiesController.getActivityByTask") 

  Route.get('/getMessageByActivity/:activity_id', 'MessagesController.getMessageByActivity')
}).prefix('/api').middleware('auth')

Route.post('/login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')

  try {
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '7 days'
    })
    return token
  } catch {
    return response.unauthorized('Invalid credentials')
  }
})

Route.post('/logout', async ({ auth }) => {
  await auth.use('api').revoke()
  
  return 'Logout realizado com sucesso'
}).middleware(['auth'])


Route.post('/forgot-password', 'ForgotPasswordController.sendToken')
Route.post('/reset-password', 'ForgotPasswordController.resetPassword')