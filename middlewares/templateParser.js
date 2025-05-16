
const templates = {
  activity_join: "您已成功参加{{activityName}}",
  interactive_like: "{{username}}点赞了你的动态"
};

module.exports = async (ctx, next) => {
  const msg = ctx.request.body;
  if (msg.template) {
    msg.content = compileTemplate(templates[msg.template], msg.variables);
  }
  await next();
};

function compileTemplate(tpl, data) {
  return tpl.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => data[key] || '');
}