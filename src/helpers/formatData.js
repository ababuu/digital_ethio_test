export default function FormatToTree(data, root) {
  let r;
  data.forEach(function (a) {
    this[a.id] = {
      id: a.id,
      key: a.ID,
      title: a.Name,
      description: a.description,
      managing_department: a.managing_department,
      children: (this[a.id] && this[a.id].children) || [],
    };

    if (a.id === root) {
      r = this[a.id];
    } else {
      this[a.managing_department] = this[a.managing_department] || {};

      this[a.managing_department].children =
        this[a.managing_department].children || [];
      this[a.managing_department].children.push(this[a.id]);
    }
  }, Object.create(null));
  return r;
}
