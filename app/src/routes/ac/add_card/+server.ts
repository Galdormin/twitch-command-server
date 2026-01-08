export async function POST({ request, locals }) {
    const formData = await request.formData();
    const cardId = formData.get('id');
    const name = formData.get('name');
    const family = formData.get('family');
    const wiki = formData.get('wiki');
    const image = formData.get('image');
    const credit = formData.get('credit');

    if (!cardId || !name || !family || !image) {
        return new Response(JSON.stringify({ error: 'ID, name, family, and image are required' }), { status: 400 });
    }

    const cardData = new FormData();
    cardData.append('card_id', cardId);
    cardData.append('name', name);
    cardData.append('family', family);
    cardData.append('wiki', wiki);
    cardData.append('image', image);
    cardData.append('credit', credit);

    try {
        await locals.pb.collection('ac_cards').create(cardData);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        console.error('Error creating card:', error);
        return new Response(JSON.stringify({ error: 'Failed to create card' }), { status: 500 });
    }
}