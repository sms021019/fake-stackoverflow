//return tag index if exists in model
//return -1 if DNE

export default function IndexTag(model, tag) {
    let tags = model.data.tags;
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].name.toLowerCase() === tag.toLowerCase()) return i;
    }
    return -1;
}