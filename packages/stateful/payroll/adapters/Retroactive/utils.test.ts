import {
  Attribute,
  ContributionCompensation,
  ContributionRating,
  Cw20Token,
  NativeToken,
} from './types'
import { computeCompensation } from './utils'

const nativeToken = (amount: number): NativeToken => ({
  denom: 'ujuno',
  amount: amount.toString(),
})
const cw20Token = (amount: number): Cw20Token => ({
  address: 'junoCw20Dao',
  amount: amount.toString(),
})

const contributionIds = [1, 2]

const attributes: Attribute[] = [
  {
    name: 'justJuno',
    cw20Tokens: [],
    nativeTokens: [nativeToken(1000)],
  },
  {
    name: 'justDao',
    cw20Tokens: [cw20Token(1000)],
    nativeTokens: [],
  },
  {
    name: 'junoAndDao',
    cw20Tokens: [cw20Token(1000)],
    nativeTokens: [nativeToken(1000)],
  },
]

describe('computeCompensation', () => {
  it('averages numbers for one contribution', () => {
    const ratings: ContributionRating[] = [
      {
        contributionId: 1,
        attributes: [0, 0, 0],
      },
      {
        contributionId: 1,
        attributes: [100, 100, 100],
      },
    ]

    const expectedCompensation: ContributionCompensation[] = [
      {
        contributionId: 1,
        compensationPerAttribute: [
          {
            averageRating: 50,
            nativeTokens: [nativeToken(1000)],
            cw20Tokens: [],
          },
          {
            averageRating: 50,
            nativeTokens: [],
            cw20Tokens: [cw20Token(1000)],
          },
          {
            averageRating: 50,
            nativeTokens: [nativeToken(1000)],
            cw20Tokens: [cw20Token(1000)],
          },
        ],
      },
      {
        contributionId: 2,
        compensationPerAttribute: [
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [],
          },
          {
            averageRating: 0,
            nativeTokens: [],
            cw20Tokens: [cw20Token(0)],
          },
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [cw20Token(0)],
          },
        ],
      },
    ]

    expect(
      computeCompensation(contributionIds, ratings, attributes)
    ).toMatchObject(expectedCompensation)
  })

  it('ignores abstains', () => {
    const ratings: ContributionRating[] = [
      {
        contributionId: 1,
        attributes: [null, null, null],
      },
      {
        contributionId: 1,
        attributes: [100, 100, 100],
      },
    ]

    const expectedCompensation: ContributionCompensation[] = [
      {
        contributionId: 1,
        compensationPerAttribute: [
          {
            averageRating: 100,
            nativeTokens: [nativeToken(1000)],
            cw20Tokens: [],
          },
          {
            averageRating: 100,
            nativeTokens: [],
            cw20Tokens: [cw20Token(1000)],
          },
          {
            averageRating: 100,
            nativeTokens: [nativeToken(1000)],
            cw20Tokens: [cw20Token(1000)],
          },
        ],
      },
      {
        contributionId: 2,
        compensationPerAttribute: [
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [],
          },
          {
            averageRating: 0,
            nativeTokens: [],
            cw20Tokens: [cw20Token(0)],
          },
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [cw20Token(0)],
          },
        ],
      },
    ]

    expect(
      computeCompensation(contributionIds, ratings, attributes)
    ).toMatchObject(expectedCompensation)
  })

  it('distributes across contributions', () => {
    const ratings: ContributionRating[] = [
      {
        contributionId: 1,
        attributes: [100, 100, 100],
      },
      {
        contributionId: 2,
        attributes: [100, 100, 100],
      },
    ]

    const expectedCompensation: ContributionCompensation[] = [
      {
        contributionId: 1,
        compensationPerAttribute: [
          {
            averageRating: 100,
            nativeTokens: [nativeToken(500)],
            cw20Tokens: [],
          },
          {
            averageRating: 100,
            nativeTokens: [],
            cw20Tokens: [cw20Token(500)],
          },
          {
            averageRating: 100,
            nativeTokens: [nativeToken(500)],
            cw20Tokens: [cw20Token(500)],
          },
        ],
      },
      {
        contributionId: 2,
        compensationPerAttribute: [
          {
            averageRating: 100,
            nativeTokens: [nativeToken(500)],
            cw20Tokens: [],
          },
          {
            averageRating: 100,
            nativeTokens: [],
            cw20Tokens: [cw20Token(500)],
          },
          {
            averageRating: 100,
            nativeTokens: [nativeToken(500)],
            cw20Tokens: [cw20Token(500)],
          },
        ],
      },
    ]

    expect(
      computeCompensation(contributionIds, ratings, attributes)
    ).toMatchObject(expectedCompensation)
  })

  it('treats all abstains as zeroes', () => {
    const ratings: ContributionRating[] = [
      {
        contributionId: 1,
        attributes: [null, null, null],
      },
      {
        contributionId: 2,
        attributes: [12, 56, 34],
      },
    ]

    const expectedCompensation: ContributionCompensation[] = [
      {
        contributionId: 1,
        compensationPerAttribute: [
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [],
          },
          {
            averageRating: 0,
            nativeTokens: [],
            cw20Tokens: [cw20Token(0)],
          },
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [cw20Token(0)],
          },
        ],
      },
      {
        contributionId: 2,
        compensationPerAttribute: [
          {
            averageRating: 12,
            nativeTokens: [nativeToken(1000)],
            cw20Tokens: [],
          },
          {
            averageRating: 56,
            nativeTokens: [],
            cw20Tokens: [cw20Token(1000)],
          },
          {
            averageRating: 34,
            nativeTokens: [nativeToken(1000)],
            cw20Tokens: [cw20Token(1000)],
          },
        ],
      },
    ]

    expect(
      computeCompensation(contributionIds, ratings, attributes)
    ).toMatchObject(expectedCompensation)
  })

  it('gives out no tokens if everyone gets a 0 or abstains', () => {
    const ratings: ContributionRating[] = [
      {
        contributionId: 1,
        attributes: [0, 0, 0],
      },
      {
        contributionId: 2,
        attributes: [null, null, null],
      },
    ]

    const expectedCompensation: ContributionCompensation[] = [
      {
        contributionId: 1,
        compensationPerAttribute: [
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [],
          },
          {
            averageRating: 0,
            nativeTokens: [],
            cw20Tokens: [cw20Token(0)],
          },
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [cw20Token(0)],
          },
        ],
      },
      {
        contributionId: 2,
        compensationPerAttribute: [
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [],
          },
          {
            averageRating: 0,
            nativeTokens: [],
            cw20Tokens: [cw20Token(0)],
          },
          {
            averageRating: 0,
            nativeTokens: [nativeToken(0)],
            cw20Tokens: [cw20Token(0)],
          },
        ],
      },
    ]

    expect(
      computeCompensation(contributionIds, ratings, attributes)
    ).toMatchObject(expectedCompensation)
  })

  it('distributes according to contribution averages', () => {
    const ratings: ContributionRating[] = [
      // Average for each: 75
      {
        contributionId: 1,
        attributes: [100, 70, 50],
      },
      {
        contributionId: 1,
        attributes: [50, 80, 100],
      },
      // Average for each: 25
      {
        contributionId: 2,
        attributes: [0, 20, null],
      },
      {
        contributionId: 2,
        attributes: [50, 30, 25],
      },
    ]

    const expectedCompensation: ContributionCompensation[] = [
      {
        contributionId: 1,
        compensationPerAttribute: [
          {
            averageRating: 75,
            nativeTokens: [nativeToken(750)],
            cw20Tokens: [],
          },
          {
            averageRating: 75,
            nativeTokens: [],
            cw20Tokens: [cw20Token(750)],
          },
          {
            averageRating: 75,
            nativeTokens: [nativeToken(750)],
            cw20Tokens: [cw20Token(750)],
          },
        ],
      },
      {
        contributionId: 2,
        compensationPerAttribute: [
          {
            averageRating: 25,
            nativeTokens: [nativeToken(250)],
            cw20Tokens: [],
          },
          {
            averageRating: 25,
            nativeTokens: [],
            cw20Tokens: [cw20Token(250)],
          },
          {
            averageRating: 25,
            nativeTokens: [nativeToken(250)],
            cw20Tokens: [cw20Token(250)],
          },
        ],
      },
    ]

    expect(
      computeCompensation(contributionIds, ratings, attributes)
    ).toMatchObject(expectedCompensation)
  })
})
