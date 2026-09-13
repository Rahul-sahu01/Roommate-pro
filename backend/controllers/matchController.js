import { User } from '../models/index.js';
import { safeUser } from '../utils/user.js';

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreMatch(currentUser, candidate) {
  const current = currentUser.preferences || {};
  const other = candidate.preferences || {};

  let total = 0;
  const reasons = [];

  const currentBudget = Number(current.budget || 0);
  const otherBudget = Number(other.budget || 0);

  let budgetScore = 0;

  if (currentBudget && otherBudget) {
    const difference = Math.abs(currentBudget - otherBudget);

    budgetScore =
      difference === 0
        ? 25
        : Math.max(
            0,
            25 -
              (difference / Math.max(currentBudget, otherBudget)) * 25
          );

    total += budgetScore;

    if (budgetScore >= 18) {
      reasons.push('Similar budget');
    }
  }

  const currentCity = String(current.city || '')
    .trim()
    .toLowerCase();

  const otherCity = String(other.city || '')
    .trim()
    .toLowerCase();

  let cityScore = 0;

  if (currentCity && otherCity === currentCity) {
    cityScore = 25;
    total += cityScore;
    reasons.push('Same preferred city');
  }

  const lifestyleKeys = ['smoking', 'sleep', 'food'];
  const matchingLifestyleCount = lifestyleKeys.filter((key) => {
    if (!current[key] || !other[key]) return false;

    return (
      current[key] === 'Any' ||
      other[key] === 'Any' ||
      current[key] === other[key]
    );
  }).length;

  const lifestyleScore = (matchingLifestyleCount / 3) * 50;
  total += lifestyleScore;

  lifestyleKeys.forEach((key) => {
    const same =
      current[key] &&
      other[key] &&
      (current[key] === 'Any' ||
        other[key] === 'Any' ||
        current[key] === other[key]);

    if (same) {
      reasons.push(`${key[0].toUpperCase()}${key.slice(1)} fits`);
    }
  });

  return {
    score: clamp(total),
    reasons: reasons.slice(0, 4),
    breakdown: {
      budget: clamp(budgetScore),
      city: cityScore,
      lifestyle: clamp(lifestyleScore),
    },
  };
}

export async function findMatches(req, res) {
  try {
    const preferences = req.body.preferences || {};

    if (req.body.save) {
      req.user.preferences = {
        ...req.user.preferences?.toObject?.(),
        ...preferences,
      };

      await req.user.save();
    }

    const people = await User.find({
      _id: { $ne: req.user._id },
      role: 'tenant',
      name: { $exists: true },
    })
      .select('-password')
      .limit(200);

    const matches = people
      .map((person) => {
        const result = scoreMatch(
          {
            ...req.user.toObject(),
            preferences,
          },
          person
        );

        return {
          ...safeUser(person),
          score: result.score,
          reasons: result.reasons,
          breakdown: result.breakdown,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return res.json({ matches });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
