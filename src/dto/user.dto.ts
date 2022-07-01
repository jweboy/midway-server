import { Rule, RuleType } from '@midwayjs/validate';

class UserLoginDTO {
  @Rule(RuleType.string().required())
  username: string;

  @Rule(RuleType.string().required())
  password: string;
}

export default UserLoginDTO;
