export const deletedReportQuery = [
  {
    $group: {
      _id: '$_id',
      isDeleted: {
        $first: '$isDeleted',
      },
    },
  },
  {
    $facet: {
      nDocs: [
        {
          $count: 'nDocs',
        },
      ],
      groupValues: [
        {
          $group: {
            _id: '$isDeleted',
            total: {
              $sum: 1,
            },
          },
        },
      ],
    },
  },
  {
    $addFields: {
      nDocs: {
        $arrayElemAt: ['$nDocs', 0],
      },
    },
  },
  {
    $unwind: '$groupValues',
  },
  {
    $project: {
      _id: 0,
      isDeleted: '$groupValues._id',
      total: '$groupValues.total',
      percentage: {
        $multiply: [
          {
            $divide: ['$groupValues.total', '$nDocs.nDocs'],
          },
          100,
        ],
      },
    },
  },
  {
    $match: {
      isDeleted: true,
    },
  },
];
