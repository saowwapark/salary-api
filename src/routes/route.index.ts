import express from 'express';
import salarySurveyRoute from './route.salary-survey'

export default function (app: express.Application) {
  app.use('/ping', ((req, res, next) => {
    return res.status(201).json({
      message: 'pong'
    });
  }));
  app.use('/job_data', salarySurveyRoute);
}
