import { PipelineStage } from 'mongoose';

export const priceDateReportQuery = (
  totalCount: number,
  match: PipelineStage,
) => {
  return [
    {
      $addFields: {
        creationDate: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: { $toDate: '$createdAt' },
          },
        },
      },
    },
    match,
    {
      $group: {
        _id: 0,
        matched: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        matched: -1 as any,
      },
    },
    {
      $project: {
        _id: 0,
        total: '$matched',
        percentage: {
          $multiply: [
            {
              $divide: ['$matched', totalCount],
            },
            100,
          ],
        },
      },
    },
  ];
};
