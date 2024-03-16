import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ChallengeRoute } from '@routes/challenge.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new ChallengeRoute()]);

app.listen();
