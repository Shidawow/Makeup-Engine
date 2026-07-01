# Internal Trial Feedback Prompts

Phase 14B defines a local safe feedback prompt pack for a future internal dry
run. The prompt pack is not a backend form, analytics event stream, CRM record,
or real user research system.

## Safe Prompts

- 你是否一眼看懂这个 App 是做什么的？
- 三套模板哪套最吸引你？
- 哪一步最像真实化妆指导？
- 哪一步最不清楚？
- 你是否相信这些步骤可以跟练？
- 是否有地方让你误以为系统正在识别你本人？
- 手机上按钮和文字是否舒服？
- 你是否愿意继续看更多妆容模板？

## Safe Recording Scope

Allowed notes are anonymous, local, and small-scope:

- task completion notes
- confusion points
- template preference
- step clarity notes
- mobile usability notes
- boundary misunderstanding notes
- willingness to continue viewing more templates

## Forbidden Collection

Do not ask for or record:

- real name
- phone number
- email
- address
- social media account
- photo
- uploaded image
- base64 image
- local photo path
- skin health information
- health condition
- sensitive identity information
- biometric identifier
- face embedding
- analytics id
- backend record
- training data

If a prompt drifts toward personal data, contact collection, photo collection,
health information, analytics, backend storage, registry write, publish, or AI
confirmed extraction, the internal trial prep must be blocked.
