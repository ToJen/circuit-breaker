import std::hashes::sha256;

// mock re-entrancy check
fn is_safe_condition_met(pre_condition: Field, post_condition: Field) -> Field {
    let condition_hash = sha256(pre_condition, post_condition);
    let known_safe_hash = 12345678;

    if condition_hash == known_safe_hash {
        return 1; // safe contract
    } else {
        return 0; // unsafe contract
    }
}

fn main(pre_condition: Field, post_condition: Field) {
    let result = is_safe_condition_met(pre_condition, post_condition);

    println(result);
}
