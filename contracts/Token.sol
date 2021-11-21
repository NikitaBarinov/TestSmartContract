// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;


contract Token {
  address public owner;
  uint256 maxDonatId = 0; 

  ///@notice donat struct
  struct donat{
    address donater;
    uint256 amount;
    uint256 id;
    bool isReceive; 
  }

///@notice struckt for convert address to understandable javascript code 
  struct donatorAddresses{
    address donater;
  }

  ///@notice struckt for convert uint to understandable javascript code 
  struct balance1{
    uint256 balance;
  }

  donatorAddresses [] private donators;
  
  ///@notice massive for save information about donats
  donat[] donats; 

  constructor() public {
    owner = msg.sender;
  }
 
  /// @notice Track user investiments
  mapping(address => uint256) private balances;

  event donatCreated(address donater, uint256 amount, uint256 Id);
  event donatTransfered(address receiver, uint idDonat);


  ///Function for accepting a donation 
  function donate() public payable {
    require (msg.value < 1e60,"The amount is too big" );

    donats.push(donat(msg.sender,msg.value,maxDonatId,false));

    maxDonatId++;

    if ((balances[msg.sender]) == 0){
      donators.push(donatorAddresses(msg.sender));
    } 

    balances[msg.sender] += msg.value;
    balances[address(this)] += msg.value;

    emit donatCreated(msg.sender,msg.value,maxDonatId);
  }

  /// Function for transfer donat to another address
  /// @param receiver.address
  /// @param idDonat.uint
  function transferTo(address payable receiver, uint256 idDonat) public payable{
    require(msg.sender == owner, "Access is denied");
    require(idDonat <= maxDonatId, "Donat does not exist");
    require(donats[idDonat].isReceive == false,"Donation has already be tranfered!");

    donats[idDonat].isReceive = true; 

    receiver.transfer(donats[idDonat].amount);

    balances[address(this)] -= donats[idDonat].amount; 

    emit donatTransfered(receiver,idDonat);
  }

/**
  @notice Getter for the Donators
  @return allDonators
 */
  function getDonators() public view returns (donatorAddresses [] memory){
    return donators;
  }

/**
  @notice Getter for balance of selected donater 
  @return Balance of selected donater
 */
  function getbalanceOf(address account) public view returns (balance1 memory) {//Получение баланса по адресу
    balance1 memory balance2;
    balance2.balance = balances[account];
    return balance2;
  }

/**
  @notice Getter for  donat
  @return Selected donat
 */
  function getdonat(uint256 id) public view returns(donat memory){//Получение одного пожертвования
    return donats[id];
  } 

}

