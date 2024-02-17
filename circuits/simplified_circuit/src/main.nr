fn main(oracle_output: bool) {
    assert(oracle_output == true);
}

#[test]
fn test_main() {
    let contract_is_safe = true;
    main(contract_is_safe);
}

#[test(should_fail)]
fn test_main_should_fail() {
    let contract_is_safe = false;
    main(contract_is_safe);
}
