import express from 'express';
import { salarySurveryController } from './../controllers/salary-survey.controller';

const router = express.Router();


router

  .get('', salarySurveryController.getJobData);

export default router;


